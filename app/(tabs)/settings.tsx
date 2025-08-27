import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Linking,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleOpenWebsite = () => {
    Linking.openURL('http://universities.hipolabs.com');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          App preferences and information
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        <View style={[styles.settingItem, { backgroundColor: colors.background }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={20} color={colors.tint} />
            <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Text style={[styles.settingValue, { color: colors.text }]}>
            {colorScheme === 'dark' ? 'On' : 'Off'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        
        <View style={[styles.settingItem, { backgroundColor: colors.background }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="information-circle" size={20} color={colors.tint} />
            <Text style={[styles.settingText, { color: colors.text }]}>Version</Text>
          </View>
          <Text style={[styles.settingValue, { color: colors.text }]}>1.0.0</Text>
        </View>

        <TouchableOpacity 
          style={[styles.settingItem, { backgroundColor: colors.background }]}
          onPress={handleOpenWebsite}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="globe" size={20} color={colors.tint} />
            <Text style={[styles.settingText, { color: colors.text }]}>Data Source</Text>
          </View>
          <View style={styles.settingRight}>
            <Text style={[styles.settingValue, { color: colors.text }]}>Hipolabs API</Text>
            <Ionicons name="open-outline" size={16} color={colors.tint} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Features</Text>
        
        <View style={[styles.featureItem, { backgroundColor: colors.background }]}>
          <Ionicons name="search" size={20} color={colors.tint} />
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Search Universities</Text>
            <Text style={[styles.featureDescription, { color: colors.text }]}>
              Find universities by country using the Hipolabs University API
            </Text>
          </View>
        </View>

        <View style={[styles.featureItem, { backgroundColor: colors.background }]}>
          <Ionicons name="star" size={20} color={colors.tint} />
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Save Favorites</Text>
            <Text style={[styles.featureDescription, { color: colors.text }]}>
              Mark universities as favorites for quick access
            </Text>
          </View>
        </View>

        <View style={[styles.featureItem, { backgroundColor: colors.background }]}>
          <Ionicons name="globe" size={20} color={colors.tint} />
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>Visit Websites</Text>
            <Text style={[styles.featureDescription, { color: colors.text }]}>
              Open university websites directly from the app
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.text }]}>
          Made with ❤️ for students worldwide
        </Text>
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    opacity: 0.7,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
}); 