// types/mapbox.d.ts
declare module '@mapbox/search-js-react' {
    import { ComponentType } from 'react';
    
    export const AddressAutofill: ComponentType<{
      accessToken: string;
      children: React.ReactElement;
      // Add other props if needed
    }>;
  }