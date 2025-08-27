import { UniversityCard } from '@/components/UniversityCard';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FavoritesService } from '@/services/favoritesService';
import { FavoriteUniversity } from '@/types/university';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [favorites, setFavorites] = useState<FavoriteUniversity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const favs = await FavoritesService.getFavorites();
      setFavorites(favs);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleFavorite = useCallback(async (university: FavoriteUniversity) => {
    try {
      await FavoritesService.removeFromFavorites(university.id);
      await loadFavorites();
    } catch (error) {
      Alert.alert('Error', 'Failed to remove from favorites');
      console.error('Remove favorite error:', error);
    }
  }, [loadFavorites]);

  const handleUniversityPress = useCallback((university: FavoriteUniversity) => {
    router.push({
      pathname: '/university-details',
      params: { university: JSON.stringify(university) }
    });
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const renderUniversity = ({ item }: { item: FavoriteUniversity }) => {
    return (
      <UniversityCard
        university={item}
        isFavorite={true}
        onToggleFavorite={() => handleToggleFavorite(item)}
        onPress={() => handleUniversityPress(item)}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Your saved universities
        </Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderUniversity}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="star" size={64} color={colors.text} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No favorites yet
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.text }]}>
                Search for universities and tap the star to save them
              </Text>
            </View>
          ) : null
        }
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
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 40,
  },
});
