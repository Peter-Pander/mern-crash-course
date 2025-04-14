// src/components/LowStockNotifications.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  List,
  ListItem,
  Text,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import { getLowStockItems } from '../utils/utility';
import { useProductStore } from '../store/product';
import { useInventorySettings } from '../context/InventorySettingsContext';

const LowStockNotifications = () => {
  const products = useProductStore((state) => state.products);
  // Use the threshold from InventorySettingsContext instead of any local control.
  const { lowStockThreshold } = useInventorySettings();
  const thresholdNumber = Number(lowStockThreshold);
  const lowStockItems = getLowStockItems(products, thresholdNumber);
  const [visible, setVisible] = useState(true);

  if (lowStockItems.length === 0 || !visible) {
    return null;
  }

  const bgColor = useColorModeValue("yellow.100", "yellow.300");
  const textColor = useColorModeValue("gray.800", "gray.900");
  const borderColor = useColorModeValue("yellow.300", "yellow.400");
  const iconColor = "black";

  return (
    <Container>
      <Box
        bg={bgColor}
        color={textColor}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        p={4}
        mt={6}
        mb={6}
        position="relative"
      >
        <IconButton
          aria-label="Dismiss notification"
          icon={<CloseIcon color={iconColor} />}
          size="sm"
          variant="ghost"
          position="absolute"
          top="4px"
          right="4px"
          onClick={() => setVisible(false)}
        />
        <Heading as="h3" size="md" mb={2}>
          Low Stock Notifications
        </Heading>
        <List spacing={2}>
          {lowStockItems.map((item) => (
            <ListItem key={item._id || item.id}>
              <Text>
                {item.name} is low on stock: Only {item.quantity} left.
              </Text>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default LowStockNotifications;
