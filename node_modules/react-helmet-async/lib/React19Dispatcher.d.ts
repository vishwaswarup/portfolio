import React, { Component } from 'react';
import type { HelmetProps } from './types';
interface React19DispatcherProps extends HelmetProps {
    /**
     * The processed props including mapped children. These come from Helmet's
     * mapChildrenToProps or the raw API props.
     */
    [key: string]: any;
}
/**
 * React 19+ Dispatcher: Instead of manual DOM manipulation, this component
 * renders actual JSX elements. React 19 automatically hoists <title>, <meta>,
 * <link>, <style>, and <script async> to <head>.
 *
 * For htmlAttributes and bodyAttributes, we still apply via direct DOM
 * manipulation since React 19 doesn't handle those.
 */
export default class React19Dispatcher extends Component<React19DispatcherProps> {
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    resolveTitle(): string | undefined;
    renderTitle(): React.DetailedReactHTMLElement<{
        [key: string]: any;
    }, HTMLElement> | null;
    renderBase(): React.DetailedReactHTMLElement<{
        [key: string]: any;
    }, HTMLElement> | null;
    renderMeta(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[] | null;
    renderLink(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[] | null;
    renderScript(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[] | null;
    renderStyle(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[] | null;
    renderNoscript(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>[] | null;
    render(): React.FunctionComponentElement<{
        children?: React.ReactNode;
    }>;
}
export {};
