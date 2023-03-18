import React, {ReactNode} from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

type CardProps = {
    children: ReactNode;
  };

const { width, height } = Dimensions.get('window');

const Card = ({ children }: CardProps) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>{children}</View>
      </View>
    );
  };

const styles = StyleSheet.create({
    card: {
        minHeight: height * 0.45,
        minWidth: height * 0.45,
        shadowOffset: { width: 0, height: 1},
        shadowColor: '#000000',
        shadowOpacity: 0.8,
        backgroundColor: '#CDD1DC',
        marginHorizontal: 5,
        marginVertical: 10,
    },
    cardContent: {

    },
})

export default Card