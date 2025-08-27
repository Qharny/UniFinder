import { CountrySelector } from '@/components/CountrySelector';
import { UniversityCard } from '@/components/UniversityCard';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FavoritesService } from '@/services/favoritesService';
import { UniversityApiService } from '@/services/universityApi';
import { University } from '@/types/university';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('Togo');
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const loadFavorites = useCallback(async () => {
    try {
      const favs = await FavoritesService.getFavorites();
      const favoriteIds = new Set(favs.map(fav => `${fav.name}-${fav.country}`));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  const searchUniversities = useCallback(async (country: string) => {
    if (!country.trim()) {
      Alert.alert('Error', 'Please enter a country name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await UniversityApiService.searchUniversities(country);
      setUniversities(results);
      
      if (results.length === 0) {
        setError('No universities found for this country');
      }
    } catch (err) {
      setError('Failed to fetch universities. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleFavorite = useCallback(async (university: University) => {
    try {
      const isFavorite = favorites.has(`${university.name}-${university.country}`);
      
      if (isFavorite) {
        // Find the favorite to remove
        const favs = await FavoritesService.getFavorites();
        const favoriteToRemove = favs.find(fav => 
          fav.name === university.name && fav.country === university.country
        );
        if (favoriteToRemove) {
          await FavoritesService.removeFromFavorites(favoriteToRemove.id);
        }
      } else {
        await FavoritesService.addToFavorites(university);
      }
      
      // Reload favorites
      await loadFavorites();
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
      console.error('Favorite toggle error:', error);
    }
  }, [favorites, loadFavorites]);

  const handleUniversityPress = useCallback((university: University) => {
    router.push({
      pathname: '/university-details',
      params: { university: JSON.stringify(university) }
    });
  }, []);

  useEffect(() => {
    loadFavorites();
    searchUniversities(selectedCountry);
  }, [loadFavorites, selectedCountry]);

  const renderUniversity = ({ item }: { item: University }) => {
    const isFavorite = favorites.has(`${item.name}-${item.country}`);
    
    return (
      <UniversityCard
        university={item}
        isFavorite={isFavorite}
        onToggleFavorite={() => handleToggleFavorite(item)}
        onPress={() => handleUniversityPress(item)}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>UniFinder</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Discover Universities Worldwide
        </Text>
      </View>

      <View style={styles.searchSection}>
        <TouchableOpacity
          style={[styles.countrySelector, { backgroundColor: colors.background, borderColor: colors.tint }]}
          onPress={() => setShowCountrySelector(true)}
        >
          <Ionicons name="location" size={20} color={colors.tint} />
          <Text style={[styles.countryText, { color: colors.text }]} numberOfLines={1}>
            {selectedCountry}
          </Text>
          <Ionicons name="chevron-down" size={20} color={colors.tint} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.tint }]}
          onPress={() => searchUniversities(selectedCountry)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Ionicons name="search" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={universities}
        renderItem={renderUniversity}
        keyExtractor={(item, index) => `${item.name}-${item.country}-${index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="school" size={64} color={colors.text} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                Search for universities by country
              </Text>
            </View>
          ) : null
        }
      />

      <CountrySelector
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        visible={showCountrySelector}
        onClose={() => setShowCountrySelector(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  countrySelector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  countryText: {
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 48,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FF6B6B20',
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});
