import { MollieApiErrorLinks, Url } from '../data/global';
import { AxiosResponse } from 'axios';
import { cloneDeep, get, has } from 'lodash';
import Maybe from '../types/Maybe';

export default class ApiError extends Error {
  public constructor(message: string, protected title?: string, protected status?: number, protected field?: string, protected links?: MollieApiErrorLinks) {
    super(message);
    this.name = 'ApiError';
  }

  /**
   * Get the error message
   *
   * @since 3.0.0
   */
  public getMessage(): string {
    return this.message;
  }

  /**
   * Get the field name that contains an error
   *
   * @since 3.0.0
   */
  public getField(): Maybe<string> {
    return this.field;
  }

  /**
   * Get the API status code
   *
   * @since 3.0.0
   */
  public getStatusCode(): Maybe<number> {
    return this.status;
  }

  /**
   * Get the documentation URL
   *
   * @since 3.0.0
   */
  public getDocumentationUrl(): string {
    return this.getUrl('documentation');
  }

  /**
   * Get the dashboard URL
   *
   * @since 3.0.0
   */
  public getDashboardUrl(): string {
    return this.getUrl('dashboard');
  }

  /**
   * Check if the link exists
   *
   * @since 3.0.0
   */
  public hasLink(key: string): boolean {
    return has(this.links, key);
  }

  /***
   * Retrieve a link by name
   *
   * @since 3.0.0
   */
  public getLink(key: string): Url {
    return get(this.links, key);
  }

  /**
   * @since 3.0.0
   */
  public getUrl(key: string): string {
    return get(this.getLink(key), 'href');
  }

  public toString(): string {
    return `ApiError: ${this.message}`;
  }

  /**
   * Creates and returns an `ApiError` from the passed response.
   *
   * @since 3.0.0
   */
  public static createFromResponse(response: AxiosResponse): ApiError {
    return new ApiError(
      get(response, 'data.detail', 'Received an error without a message'),
      get(response, 'data.title'),
      get(response, 'data.status'),
      get(response, 'data.field'),
      cloneDeep(get(response, 'data._links')),
    );
  }
}
