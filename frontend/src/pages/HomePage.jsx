import { Container, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/product';
import ProductCard from '../components/ProductCard';
import LowStockNotifications from '../components/LowStockNotifications';
import { useInventorySettings } from "../context/InventorySettingsContext";  // Import our new context

const HomePage = () => {
  const { fetchProducts, products, lowStockThreshold } = useProductStore();
  // Use inventory settings from context instead of local state.
  const { showLowStockOnly, sortOrder } = useInventorySettings();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Apply filters and sorting using the shared settings.
  const sortedFilteredProducts = products
    .filter(product =>
      showLowStockOnly ? product.quantity < lowStockThreshold : true
    )
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") {
        return a.quantity - b.quantity;
      }
      // sortOrder is "highToLow"
      return b.quantity - a.quantity;
    });

  return (
    <Container maxW={"container.xl"} py={12}>
      <VStack spacing={8}>
        {/* Heading and Low Stock Notifications */}
        <VStack spacing={4} w="full">
          <Text
            fontSize={"30"}
            fontWeight={"bold"}
            bgGradient={"linear(to-r, cyan.400, blue.500)"}
            bgClip={"text"}
            textAlign={"center"}
          >
            Inventory
          </Text>
          <LowStockNotifications />
        </VStack>

        {/* Filter and Sort Controls removed from here (now in Navbar) */}

        {/* Product List */}
        <SimpleGrid
          columns={{
            base: 1,
            md: 2,
            lg: 3,
          }}
          spacing={10}
          w={"full"}
        >
          {sortedFilteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </SimpleGrid>

        {sortedFilteredProducts.length === 0 && (
          <Text
            fontSize="xl"
            textAlign={"center"}
            fontWeight="bold"
            color="gray.500"
          >
            No products found 😢{" "}
            <Link to={"/create"}>
              <Text
                as="span"
                color="blue.500"
                _hover={{ textDecoration: "underline" }}
              >
                Create a product
              </Text>
            </Link>
          </Text>
        )}
      </VStack>
    </Container>
  );
};

export default HomePage;
