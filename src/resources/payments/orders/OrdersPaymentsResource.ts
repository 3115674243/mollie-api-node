import { CreateParameters } from './parameters';
import { PaymentData } from '../../../data/payments/data';
import ApiError from '../../../errors/ApiError';
import Callback from '../../../types/Callback';
import ParentedResource from '../../ParentedResource';
import Payment, { injectPrototypes } from '../../../data/payments/Payment';
import checkId from '../../../plumbing/checkId';
import renege from '../../../plumbing/renege';

/**
 * The `orders_payments` resource
 *
 * @since 3.1.0
 */
export default class OrdersPaymentsResource extends ParentedResource<PaymentData, Payment> {
  protected getResourceUrl(orderId: string): string {
    return `orders/${orderId}/payments`;
  }

  protected injectPrototypes = injectPrototypes;

  /**
   * Create order payment
   *
   * @param params - Create order payment parameters
   *                 (DEPRECATED SINCE 3.0.0) Can also be a callback function
   * @param cb - (DEPRECATED SINCE 3.0.0) Callback function, can be used instead of the returned `Promise` object
   *
   * @returns The created Payment object
   *
   * @since 3.1.0
   *
   * @see https://docs.mollie.com/reference/v2/orders-api/create-order-payment
   *
   * @public ✓ This method is part of the public API
   */
  public create(parameters: CreateParameters): Promise<Payment>;
  public create(parameters: CreateParameters, callback: Callback<Payment>): void;
  public create(parameters: CreateParameters) {
    if (renege(this, this.create, ...arguments)) return;
    const orderId = this.getParentId(parameters.orderId);
    if (!checkId(orderId, 'order')) {
      throw new ApiError('The order id is invalid');
    }
    const { orderId: _, ...data } = parameters;
    return this.network.post(this.getResourceUrl(orderId!), data);
  }
}
