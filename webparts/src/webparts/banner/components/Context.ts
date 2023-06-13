import { createContext } from 'react';
import { IContextProps } from './Entities';

/**
 * @summary Para usar o contexto, declarar no componente:
 * @example
 * const context = useContext(Context);
 *
 * @summary Meter o componente como filho do provider:
 * @example
 * <Context.Provider value={{ wpContext: this.props.spContext }}>
 *    <CustomComponent>
 * </Context.Provider>
 */
export const Context: React.Context<IContextProps> = createContext<IContextProps>({
  wpContext: undefined
});