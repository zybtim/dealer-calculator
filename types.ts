
export interface PriceData {
  [height: number]: {
    [width: number]: number;
  };
}

export interface CalculationResult {
  price: number | null;
  roundedWidth: number;
  roundedHeight: number;
  isOutOfBounds: boolean;
}
