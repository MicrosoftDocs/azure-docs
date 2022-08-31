using System;
using Azure;
using Azure.AI.FormRecognizer.DocumentAnalysis;

namespace FormRecognizerSample
{
    internal class Program
    {
        static void Main(string[] args)
        {
            var endpoint = args.Length > 0 ? args[0] : "<your-endpoint>";
            var key = args.Length > 1 ? args[1] : "<your-key>";
            var documentUrl = args.Length > 2 ? args[2] : "<your-document-url>";
            var modelId = "prebuilt-invoice";

            var client = new DocumentAnalysisClient(new Uri(endpoint), new AzureKeyCredential(key));
            var operation = client.StartAnalyzeDocumentFromUri(modelId, new Uri(documentUrl));
            var result = operation.WaitForCompletion().Value;
            foreach (var document in result.Documents)
            {
                switch (document.DocType)
                {
                    case "invoice": ProcessInvoice(document); break;
                }
            }
        }

        static void ProcessInvoice(AnalyzedDocument document)
        {
            Console.WriteLine($"Document: {document.DocType}");
            if (document.Fields.TryGetValue("CustomerName", out DocumentField? customerNameField))
            {
                Console.WriteLine($"  CustomerName: Value={customerNameField.AsString()}   Confidence={customerNameField.Confidence}");
            }
            if (document.Fields.TryGetValue("CustomerId", out DocumentField? customerIdField))
            {
                Console.WriteLine($"  CustomerId: Value={customerIdField.AsString()}   Confidence={customerIdField.Confidence}");
            }
            if (document.Fields.TryGetValue("PurchaseOrder", out DocumentField? purchaseOrderField))
            {
                Console.WriteLine($"  PurchaseOrder: Value={purchaseOrderField.AsString()}   Confidence={purchaseOrderField.Confidence}");
            }
            if (document.Fields.TryGetValue("InvoiceId", out DocumentField? invoiceIdField))
            {
                Console.WriteLine($"  InvoiceId: Value={invoiceIdField.AsString()}   Confidence={invoiceIdField.Confidence}");
            }
            if (document.Fields.TryGetValue("InvoiceDate", out DocumentField? invoiceDateField))
            {
                Console.WriteLine($"  InvoiceDate: Value={invoiceDateField.AsDate()}   Confidence={invoiceDateField.Confidence}");
            }
            if (document.Fields.TryGetValue("DueDate", out DocumentField? dueDateField))
            {
                Console.WriteLine($"  DueDate: Value={dueDateField.AsDate()}   Confidence={dueDateField.Confidence}");
            }
            if (document.Fields.TryGetValue("VendorName", out DocumentField? vendorNameField))
            {
                Console.WriteLine($"  VendorName: Value={vendorNameField.AsString()}   Confidence={vendorNameField.Confidence}");
            }
            if (document.Fields.TryGetValue("VendorAddress", out DocumentField? vendorAddressField))
            {
                Console.WriteLine($"  VendorAddress: Value={vendorAddressField.AsString()}   Confidence={vendorAddressField.Confidence}");
            }
            if (document.Fields.TryGetValue("VendorAddressRecipient", out DocumentField? vendorAddressRecipientField))
            {
                Console.WriteLine($"  VendorAddressRecipient: Value={vendorAddressRecipientField.AsString()}   Confidence={vendorAddressRecipientField.Confidence}");
            }
            if (document.Fields.TryGetValue("CustomerAddress", out DocumentField? customerAddressField))
            {
                Console.WriteLine($"  CustomerAddress: Value={customerAddressField.AsString()}   Confidence={customerAddressField.Confidence}");
            }
            if (document.Fields.TryGetValue("CustomerAddressRecipient", out DocumentField? customerAddressRecipientField))
            {
                Console.WriteLine($"  CustomerAddressRecipient: Value={customerAddressRecipientField.AsString()}   Confidence={customerAddressRecipientField.Confidence}");
            }
            if (document.Fields.TryGetValue("BillingAddress", out DocumentField? billingAddressField))
            {
                Console.WriteLine($"  BillingAddress: Value={billingAddressField.AsString()}   Confidence={billingAddressField.Confidence}");
            }
            if (document.Fields.TryGetValue("BillingAddressRecipient", out DocumentField? billingAddressRecipientField))
            {
                Console.WriteLine($"  BillingAddressRecipient: Value={billingAddressRecipientField.AsString()}   Confidence={billingAddressRecipientField.Confidence}");
            }
            if (document.Fields.TryGetValue("ShippingAddress", out DocumentField? shippingAddressField))
            {
                Console.WriteLine($"  ShippingAddress: Value={shippingAddressField.AsString()}   Confidence={shippingAddressField.Confidence}");
            }
            if (document.Fields.TryGetValue("ShippingAddressRecipient", out DocumentField? shippingAddressRecipientField))
            {
                Console.WriteLine($"  ShippingAddressRecipient: Value={shippingAddressRecipientField.AsString()}   Confidence={shippingAddressRecipientField.Confidence}");
            }
            if (document.Fields.TryGetValue("SubTotal", out DocumentField? subTotalField))
            {
                Console.WriteLine($"  SubTotal: Value={subTotalField.AsCurrency()}   Confidence={subTotalField.Confidence}");
            }
            if (document.Fields.TryGetValue("TotalTax", out DocumentField? totalTaxField))
            {
                Console.WriteLine($"  TotalTax: Value={totalTaxField.AsCurrency()}   Confidence={totalTaxField.Confidence}");
            }
            if (document.Fields.TryGetValue("InvoiceTotal", out DocumentField? invoiceTotalField))
            {
                Console.WriteLine($"  InvoiceTotal: Value={invoiceTotalField.AsCurrency()}   Confidence={invoiceTotalField.Confidence}");
            }
            if (document.Fields.TryGetValue("AmountDue", out DocumentField? amountDueField))
            {
                Console.WriteLine($"  AmountDue: Value={amountDueField.AsCurrency()}   Confidence={amountDueField.Confidence}");
            }
            if (document.Fields.TryGetValue("PreviousUnpaidBalance", out DocumentField? previousUnpaidBalanceField))
            {
                Console.WriteLine($"  PreviousUnpaidBalance: Value={previousUnpaidBalanceField.AsCurrency()}   Confidence={previousUnpaidBalanceField.Confidence}");
            }
            if (document.Fields.TryGetValue("RemittanceAddress", out DocumentField? remittanceAddressField))
            {
                Console.WriteLine($"  RemittanceAddress: Value={remittanceAddressField.AsString()}   Confidence={remittanceAddressField.Confidence}");
            }
            if (document.Fields.TryGetValue("RemittanceAddressRecipient", out DocumentField? remittanceAddressRecipientField))
            {
                Console.WriteLine($"  RemittanceAddressRecipient: Value={remittanceAddressRecipientField.AsString()}   Confidence={remittanceAddressRecipientField.Confidence}");
            }
            if (document.Fields.TryGetValue("ServiceAddress", out DocumentField? serviceAddressField))
            {
                Console.WriteLine($"  ServiceAddress: Value={serviceAddressField.AsString()}   Confidence={serviceAddressField.Confidence}");
            }
            if (document.Fields.TryGetValue("ServiceAddressRecipient", out DocumentField? serviceAddressRecipientField))
            {
                Console.WriteLine($"  ServiceAddressRecipient: Value={serviceAddressRecipientField.AsString()}   Confidence={serviceAddressRecipientField.Confidence}");
            }
            if (document.Fields.TryGetValue("ServiceStartDate", out DocumentField? serviceStartDateField))
            {
                Console.WriteLine($"  ServiceStartDate: Value={serviceStartDateField.AsDate()}   Confidence={serviceStartDateField.Confidence}");
            }
            if (document.Fields.TryGetValue("ServiceEndDate", out DocumentField? serviceEndDateField))
            {
                Console.WriteLine($"  ServiceEndDate: Value={serviceEndDateField.AsDate()}   Confidence={serviceEndDateField.Confidence}");
            }
            if (document.Fields.TryGetValue("TotalVAT", out DocumentField? totalVATField))
            {
                Console.WriteLine($"  TotalVAT: Value={totalVATField.AsCurrency()}   Confidence={totalVATField.Confidence}");
            }
            if (document.Fields.TryGetValue("VendorTaxId", out DocumentField? vendorTaxIdField))
            {
                Console.WriteLine($"  VendorTaxId: Value={vendorTaxIdField.AsString()}   Confidence={vendorTaxIdField.Confidence}");
            }
            if (document.Fields.TryGetValue("CustomerTaxId", out DocumentField? customerTaxIdField))
            {
                Console.WriteLine($"  CustomerTaxId: Value={customerTaxIdField.AsString()}   Confidence={customerTaxIdField.Confidence}");
            }
            if (document.Fields.TryGetValue("PaymentTerm", out DocumentField? paymentTermField))
            {
                Console.WriteLine($"  PaymentTerm: Value={paymentTermField.AsString()}   Confidence={paymentTermField.Confidence}");
            }
            if (document.Fields.TryGetValue("Items", out DocumentField? itemsField))
            {
                var index = 0;
                foreach (var item in itemsField.AsList())
                {
                    var itemFields = item.AsDictionary();
                    if (itemFields.TryGetValue("Amount", out DocumentField? amountField))
                    {
                        Console.WriteLine($"  Items[{index}].Amount: Value={amountField.AsCurrency()}   Confidence={amountField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Date", out DocumentField? dateField))
                    {
                        Console.WriteLine($"  Items[{index}].Date: Value={dateField.AsDate()}   Confidence={dateField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Description", out DocumentField? descriptionField))
                    {
                        Console.WriteLine($"  Items[{index}].Description: Value={descriptionField.AsString()}   Confidence={descriptionField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Quantity", out DocumentField? quantityField))
                    {
                        Console.WriteLine($"  Items[{index}].Quantity: Value={quantityField.AsDouble()}   Confidence={quantityField.Confidence}");
                    }
                    if (itemFields.TryGetValue("ProductCode", out DocumentField? productCodeField))
                    {
                        Console.WriteLine($"  Items[{index}].ProductCode: Value={productCodeField.AsString()}   Confidence={productCodeField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Tax", out DocumentField? taxField))
                    {
                        Console.WriteLine($"  Items[{index}].Tax: Value={taxField.AsCurrency()}   Confidence={taxField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Unit", out DocumentField? unitField))
                    {
                        Console.WriteLine($"  Items[{index}].Unit: Value={unitField.AsString()}   Confidence={unitField.Confidence}");
                    }
                    if (itemFields.TryGetValue("UnitPrice", out DocumentField? unitPriceField))
                    {
                        Console.WriteLine($"  Items[{index}].UnitPrice: Value={unitPriceField.AsCurrency()}   Confidence={unitPriceField.Confidence}");
                    }
                    if (itemFields.TryGetValue("VAT", out DocumentField? vATField))
                    {
                        Console.WriteLine($"  Items[{index}].VAT: Value={vATField.AsCurrency()}   Confidence={vATField.Confidence}");
                    }
                    index++;
                }
            }
        }
    }
}