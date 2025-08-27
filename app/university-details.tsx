import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FavoritesService } from '@/services/favoritesService';
import { University } from '@/types/university';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Linking,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function UniversityDetailsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useLocalSearchParams();
  
  const [university, setUniversity] = useState<University | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (params.university) {
      try {
        const uni = JSON.parse(params.university as string) as University;
        setUniversity(uni);
        checkFavoriteStatus(uni);
      } catch (error) {
        console.error('Error parsing university data:', error);
        Alert.alert('Error', 'Failed to load university details');
        router.back();
      }
    }
  }, [params.university]);

  const checkFavoriteStatus = async (uni: University) => {
    try {
      const favorite = await FavoritesService.isFavorite(uni);
      setIsFavorite(favorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!university) return;

    try {
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
      
      setIsFavorite(!isFavorite);
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
      console.error('Favorite toggle error:', error);
    }
  };

  const handleWebsitePress = (url: string) => {
    Linking.openURL(url);
  };

  if (!university) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
          <Ionicons 
            name={isFavorite ? 'star' : 'star-outline'} 
            size={24} 
            color={isFavorite ? '#FFD700' : colors.text} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={[styles.universityName, { color: colors.text }]}>
            {university.name}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={colors.tint} />
            <Text style={[styles.locationText, { color: colors.text }]}>
              {university.country}
              {university.state_province && `, ${university.state_province}`}
            </Text>
          </View>
        </View>

        {university.domains.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Domain</Text>
            <View style={styles.domainsContainer}>
              {university.domains.map((domain, index) => (
                <View key={index} style={[styles.domainChip, { backgroundColor: colors.tint + '20' }]}>
                  <Text style={[styles.domainText, { color: colors.tint }]}>{domain}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {university.web_pages.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Website</Text>
            {university.web_pages.map((url, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.websiteButton, { backgroundColor: colors.tint }]}
                onPress={() => handleWebsitePress(url)}
              >
                <Ionicons name="open-outline" size={16} color="white" />
                <Text style={styles.websiteText}>{url}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Country Code</Text>
          <View style={[styles.codeChip, { backgroundColor: colors.tint + '20' }]}>
            <Text style={[styles.codeText, { color: colors.tint }]}>
              {university.alpha_two_code}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  universityName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 32,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    marginLeft: 8,
    opacity: 0.8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  domainsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  domainChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  domainText: {
    fontSize: 14,
    fontWeight: '500',
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  websiteText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  codeChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
}); 