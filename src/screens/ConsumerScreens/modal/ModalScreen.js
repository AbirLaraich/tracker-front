import axios from 'axios';
import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, ScrollView, Dimensions } from 'react-native';

const ModalScreen = ({ setStatus, product }) => {
    const scrollViewRef = useRef();
    const [scrollPercentage, setScrollPercentage] = useState(0);

    const handleScroll = (event) => {
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const scrollOffset = event.nativeEvent.contentOffset.y;
        const scrollPercentage = scrollOffset / (contentHeight - scrollViewHeight);
        setScrollPercentage(scrollPercentage);
    };

    const handleScrollTo = (p) => {
        const scrollViewHeight = Dimensions.get('window').height;
        const contentHeight = scrollViewRef.current?.getScrollableNode().props.contentHeight;
        const scrollToPoint = p * (contentHeight - scrollViewHeight);
        scrollViewRef.current?.scrollTo({ y: scrollToPoint, animated: true });
    };
    const slide = React.useRef(new Animated.Value(300)).current;
    const slideUp = () => {
        // Will change slide up the bottom sheet
        Animated.timing(slide, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start();
    };

    const slideDown = () => {
        // Will slide down the bottom sheet
        Animated.timing(slide, {
            toValue: 300,
            duration: 800,
            useNativeDriver: true,
        }).start();
    };

    React.useEffect(() => {
        slideUp();
    }, []);

    const closeModal = () => {
        slideDown();
        setTimeout(() => {
            setStatus(false);
        }, 800);
    };

    // Détermine si le produit est en circuit court de proximité (distance <= 80 km)
    const isCloseProximity = product.distance <= 80;

    return (
        <Pressable onPress={closeModal} style={styles.backdrop}>
            <Pressable style={{ width: '100%', marginTop: '60%', flex: 1 }}>
                <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slide }] }]}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent} horizontal={false} persistentScrollbar={true} showsVerticalScrollIndicator={true} >
                        <View style={styles.slideBar} />
                        <Text style={styles.header}>Product Details</Text>

                        <Text style={[styles.distance, { color: isCloseProximity ? 'green' : 'orange' }]}>
                            {product.distance} km
                        </Text>

                        {isCloseProximity ? (
                            <Text style={styles.proximityText}>
                                Ce produit provient d'un <Text style={{ fontWeight: 'bold' }}>circuit court de proximité</Text>, garantissant fraîcheur et soutien aux producteurs locaux.
                            </Text>
                        ) : (
                            <Text style={styles.nonProximityText}>
                                Ce produit ne provient pas d'un <Text style={{ fontWeight: 'bold' }}>circuit court de proximité</Text>, mais nous nous efforçons de réduire les distances pour vous offrir des produits frais.
                            </Text>
                        )}

                        <View style={styles.detailsContainer}>
                            <Detail label="Distributer Address:" value={product.distributer.adresse} />
                            <Detail label="Distributer Email:" value={product.distributer.email} />
                            <Detail label="Distributer Name:" value={product.distributer.name} />
                            <Detail label="Lot Number:" value={product.numLot} />
                            <Detail label="Product Number:" value={product.numProduct} />
                            <Detail label="Weight:" value={product.weight} />
                            <Detail label="Hashed Data:" value={product.hashedData} />
                            <Detail label="Hash:" value={product.hash} />
                        </View>
                    </ScrollView>
                </Animated.View>
            </Pressable>
        </Pressable>
    );
};

const Detail = ({ label, value }) => (
    <View style={styles.detailRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    backdrop: {
        position: 'absolute',
        flex: 1,
        top: 0,
        left: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    bottomSheet: {
        width: '100%',
        height: 600,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    scrollViewContent: {
        flexGrow: 1,
        overflow: "active",
    },
    slideBar: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        alignSelf: 'center',
        marginVertical: 10,
        borderRadius: 2.5,
    },
    header: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    distance: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    proximityText: {
        color: 'green',
        textAlign: 'center',
        marginBottom: 10,
    },
    nonProximityText: {
        color: 'orange',
        textAlign: 'center',
        marginBottom: 10,
    },
    detailsContainer: {
        marginTop: 10,
    },
    detailRow: {
        marginBottom: 15,
    },
    label: {
        fontSize: 15,
        color: '#666',
        fontWeight: 'bold',
    },
    value: {
        fontSize: 16,
        color: 'black',
    },
});

export default ModalScreen;
