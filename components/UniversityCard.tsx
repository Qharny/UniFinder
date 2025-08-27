import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { University } from '@/types/university';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UniversityCardProps {
  university: University;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
}

export function UniversityCard({ university, isFavorite, onToggleFavorite, onPress }: UniversityCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleWebsitePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: colors.background }]} onPress={onPress}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {university.name}
        </Text>
        <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteButton}>
          <Ionicons 
            name={isFavorite ? 'star' : 'star-outline'} 
            size={24} 
            color={isFavorite ? '#FFD700' : colors.text} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color={colors.tint} />
          <Text style={[styles.detailText, { color: colors.text }]}>
            {university.country}
            {university.state_province && `, ${university.state_province}`}
          </Text>
        </View>
        
        {university.domains.length > 0 && (
          <View style={styles.detailRow}>
            <Ionicons name="globe" size={16} color={colors.tint} />
            <Text style={[styles.detailText, { color: colors.text }]} numberOfLines={1}>
              {university.domains[0]}
            </Text>
          </View>
        )}
      </View>

      {university.web_pages.length > 0 && (
        <TouchableOpacity 
          style={[styles.websiteButton, { backgroundColor: colors.tint }]}
          onPress={() => handleWebsitePress(university.web_pages[0])}
        >
          <Ionicons name="open-outline" size={16} color="white" />
          <Text style={styles.websiteText}>Visit Website</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
  },
  websiteText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
}); 