import { render } from '@testing-library/react';

import Tl8React from './tl8-react';

describe('Tl8React', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tl8React />);
    expect(baseElement).toBeTruthy();
  });
});
