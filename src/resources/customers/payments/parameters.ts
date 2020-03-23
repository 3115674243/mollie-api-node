import { PaymentData } from '../../../data/payments/data';
import { PaymentMethod } from '../../../data/global';
import { PickOptional } from '../../../types/PickOptional';

interface ContextParameters {
  customerId: string;
}

export type CreateParameters = ContextParameters &
  Pick<PaymentData, 'amount' | 'description'> &
  PickOptional<PaymentData, 'locale' | 'mandateId' | 'metadata' | 'sequenceType' | 'webhookUrl' | 'redirectUrl'> & {
    /**
     * Normally, a payment method screen is shown. However, when using this parameter, you can choose a specific payment
     * method and your customer will skip the selection screen and is sent directly to the chosen payment method. The
     * parameter enables you to fully integrate the payment method selection into your website.
     *
     * You can also specify the methods in an array. By doing so we will still show the payment method selection screen
     * but will only show the methods specified in the array. For example, you can use this functionality to only show
     * payment methods from a specific country to your customer `['bancontact', 'belfius', 'inghomepay']`.
     */
    method: PaymentMethod | PaymentMethod[];
  };

export type ListParameters = ContextParameters;
