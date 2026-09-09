import type { PropsWithChildren } from 'react';
import React, { Component } from 'react';
import type { HelmetProps } from './types';
export type { Attributes, BodyProps, HelmetDatum, HelmetHTMLBodyDatum, HelmetHTMLElementDatum, HelmetProps, HelmetServerState, HelmetTags, HtmlProps, LinkProps, MetaProps, StateUpdate, TagList, TitleProps, } from './types';
export { default as HelmetData } from './HelmetData';
export { default as HelmetProvider } from './Provider';
export declare class Helmet extends Component<PropsWithChildren<HelmetProps>> {
    static defaultProps: {
        defer: boolean;
        encodeSpecialCharacters: boolean;
        prioritizeSeoTags: boolean;
    };
    shouldComponentUpdate(nextProps: HelmetProps): boolean;
    private mapNestedChildrenToProps;
    private flattenArrayTypeChildren;
    private mapObjectTypeChildren;
    private mapArrayTypeChildrenToProps;
    private warnOnInvalidChildren;
    private mapChildrenToProps;
    render(): React.JSX.Element;
}
