import React from 'react';
import useNuiEvent from '../../hooks/useNuiEvent';
import InventoryCharacter from './InventoryCharacter';
import InventoryGrid from './InventoryGrid';
import InventoryControl from './InventoryControl';
import InventoryHotbar from './InventoryHotbar';
import Fade from '../utils/Fade';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  selectCharacterInventory,
  selectLeftInventory,
  selectRightInventory,
  setupInventory,
  refreshSlots,
} from '../../store/inventory';
import { useExitListener } from '../../hooks/useExitListener';
import ReactTooltip from 'react-tooltip';
import type { Inventory as InventoryProps } from '../../typings';

const Inventory: React.FC = () => {
  const [inventoryVisible, setInventoryVisible] = React.useState(false);

  useNuiEvent<boolean>('setInventoryVisible', setInventoryVisible);
  useNuiEvent<false>('closeInventory', () => {
    setInventoryVisible(false);
    ReactTooltip.hide();
  });
  useExitListener(setInventoryVisible);

  const characterInventory = useAppSelector(selectCharacterInventory);
  const leftInventory = useAppSelector(selectLeftInventory);
  const rightInventory = useAppSelector(selectRightInventory);

  const dispatch = useAppDispatch();

  useNuiEvent<{
    characterInventory: InventoryProps;
    leftInventory?: InventoryProps;
    rightInventory?: InventoryProps;
  }>('setupInventory', (data) => {
    dispatch(setupInventory(data));
    !inventoryVisible && setInventoryVisible(true);
  });

  useNuiEvent('refreshSlots', (data) => dispatch(refreshSlots(data)));

  return (
    <>
      <Fade visible={inventoryVisible} className="center-wrapper">
        <InventoryCharacter inventory={characterInventory} />
        <InventoryGrid inventory={leftInventory} />
        <InventoryControl />
        <InventoryGrid inventory={rightInventory} />
      </Fade>
      <InventoryHotbar items={leftInventory.items.slice(0, 5)} />
    </>
  );
};

export default Inventory;
