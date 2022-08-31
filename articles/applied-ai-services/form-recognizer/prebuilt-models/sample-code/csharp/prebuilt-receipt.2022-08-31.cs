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
            var modelId = "prebuilt-receipt";

            var client = new DocumentAnalysisClient(new Uri(endpoint), new AzureKeyCredential(key));
            var operation = client.StartAnalyzeDocumentFromUri(modelId, new Uri(documentUrl));
            var result = operation.WaitForCompletion().Value;
            foreach (var document in result.Documents)
            {
                switch (document.DocType)
                {
                    case "receipt": ProcessReceipt(document); break;
                    case "receipt.retailMeal": ProcessReceipt_RetailMeal(document); break;
                    case "receipt.creditCard": ProcessReceipt_CreditCard(document); break;
                    case "receipt.gas": ProcessReceipt_Gas(document); break;
                    case "receipt.parking": ProcessReceipt_Parking(document); break;
                    case "receipt.hotel": ProcessReceipt_Hotel(document); break;
                }
            }
        }

        static void ProcessReceipt(AnalyzedDocument document)
        {
            Console.WriteLine($"Document: {document.DocType}");
            if (document.Fields.TryGetValue("MerchantName", out DocumentField? merchantNameField))
            {
                Console.WriteLine($"  MerchantName: Value={merchantNameField.AsString()}   Confidence={merchantNameField.Confidence}");
            }
            if (document.Fields.TryGetValue("MerchantPhoneNumber", out DocumentField? merchantPhoneNumberField))
            {
                Console.WriteLine($"  MerchantPhoneNumber: Value={merchantPhoneNumberField.AsPhoneNumber()}   Confidence={merchantPhoneNumberField.Confidence}");
            }
            if (document.Fields.TryGetValue("MerchantAddress", out DocumentField? merchantAddressField))
            {
                Console.WriteLine($"  MerchantAddress: Value={merchantAddressField.AsAddress()}   Confidence={merchantAddressField.Confidence}");
            }
            if (document.Fields.TryGetValue("Total", out DocumentField? totalField))
            {
                Console.WriteLine($"  Total: Value={totalField.AsDouble()}   Confidence={totalField.Confidence}");
            }
            if (document.Fields.TryGetValue("TransactionDate", out DocumentField? transactionDateField))
            {
                Console.WriteLine($"  TransactionDate: Value={transactionDateField.AsDate()}   Confidence={transactionDateField.Confidence}");
            }
            if (document.Fields.TryGetValue("TransactionTime", out DocumentField? transactionTimeField))
            {
                Console.WriteLine($"  TransactionTime: Value={transactionTimeField.AsTime()}   Confidence={transactionTimeField.Confidence}");
            }
            if (document.Fields.TryGetValue("Subtotal", out DocumentField? subtotalField))
            {
                Console.WriteLine($"  Subtotal: Value={subtotalField.AsDouble()}   Confidence={subtotalField.Confidence}");
            }
            if (document.Fields.TryGetValue("TotalTax", out DocumentField? totalTaxField))
            {
                Console.WriteLine($"  TotalTax: Value={totalTaxField.AsDouble()}   Confidence={totalTaxField.Confidence}");
            }
            if (document.Fields.TryGetValue("Tip", out DocumentField? tipField))
            {
                Console.WriteLine($"  Tip: Value={tipField.AsDouble()}   Confidence={tipField.Confidence}");
            }
            if (document.Fields.TryGetValue("Items", out DocumentField? itemsField))
            {
                var index = 0;
                foreach (var item in itemsField.AsList())
                {
                    var itemFields = item.AsDictionary();
                    if (itemFields.TryGetValue("TotalPrice", out DocumentField? totalPriceField))
                    {
                        Console.WriteLine($"  Items[{index}].TotalPrice: Value={totalPriceField.AsDouble()}   Confidence={totalPriceField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Description", out DocumentField? descriptionField))
                    {
                        Console.WriteLine($"  Items[{index}].Description: Value={descriptionField.AsString()}   Confidence={descriptionField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Quantity", out DocumentField? quantityField))
                    {
                        Console.WriteLine($"  Items[{index}].Quantity: Value={quantityField.AsDouble()}   Confidence={quantityField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Price", out DocumentField? priceField))
                    {
                        Console.WriteLine($"  Items[{index}].Price: Value={priceField.AsDouble()}   Confidence={priceField.Confidence}");
                    }
                    index++;
                }
            }
        }

        static void ProcessReceipt_RetailMeal(AnalyzedDocument document)
        {
            Console.WriteLine($"Document: {document.DocType}");
            if (document.Fields.TryGetValue("MerchantName", out DocumentField? merchantNameField))
            {
                Console.WriteLine($"  MerchantName: Value={merchantNameField.AsString()}   Confidence={merchantNameField.Confidence}");
            }
            if (document.Fields.TryGetValue("MerchantPhoneNumber", out DocumentField? merchantPhoneNumberField))
            {
                Console.WriteLine($"  MerchantPhoneNumber: Value={merchantPhoneNumberField.AsPhoneNumber()}   Confidence={merchantPhoneNumberField.Confidence}");
            }
            if (document.Fields.TryGetValue("MerchantAddress", out DocumentField? merchantAddressField))
            {
                Console.WriteLine($"  MerchantAddress: Value={merchantAddressField.AsAddress()}   Confidence={merchantAddressField.Confidence}");
            }
            if (document.Fields.TryGetValue("Total", out DocumentField? totalField))
            {
                Console.WriteLine($"  Total: Value={totalField.AsDouble()}   Confidence={totalField.Confidence}");
            }
            if (document.Fields.TryGetValue("TransactionDate", out DocumentField? transactionDateField))
            {
                Console.WriteLine($"  TransactionDate: Value={transactionDateField.AsDate()}   Confidence={transactionDateField.Confidence}");
            }
            if (document.Fields.TryGetValue("TransactionTime", out DocumentField? transactionTimeField))
            {
                Console.WriteLine($"  TransactionTime: Value={transactionTimeField.AsTime()}   Confidence={transactionTimeField.Confidence}");
            }
            if (document.Fields.TryGetValue("Subtotal", out DocumentField? subtotalField))
            {
                Console.WriteLine($"  Subtotal: Value={subtotalField.AsDouble()}   Confidence={subtotalField.Confidence}");
            }
            if (document.Fields.TryGetValue("TotalTax", out DocumentField? totalTaxField))
            {
                Console.WriteLine($"  TotalTax: Value={totalTaxField.AsDouble()}   Confidence={totalTaxField.Confidence}");
            }
            if (document.Fields.TryGetValue("Tip", out DocumentField? tipField))
            {
                Console.WriteLine($"  Tip: Value={tipField.AsDouble()}   Confidence={tipField.Confidence}");
            }
            if (document.Fields.TryGetValue("Items", out DocumentField? itemsField))
            {
                var index = 0;
                foreach (var item in itemsField.AsList())
                {
                    var itemFields = item.AsDictionary();
                    if (itemFields.TryGetValue("TotalPrice", out DocumentField? totalPriceField))
                    {
                        Console.WriteLine($"  Items[{index}].TotalPrice: Value={totalPriceField.AsDouble()}   Confidence={totalPriceField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Description", out DocumentField? descriptionField))
                    {
                        Console.WriteLine($"  Items[{index}].Description: Value={descriptionField.AsString()}   Confidence={descriptionField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Quantity", out DocumentField? quantityField))
                    {
                        Console.WriteLine($"  Items[{index}].Quantity: Value={quantityField.AsDouble()}   Confidence={quantityField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Price", out DocumentField? priceField))
                    {
                        Console.WriteLine($"  Items[{index}].Price: Value={priceField.AsDouble()}   Confidence={priceField.Confidence}");
                    }
                    index++;
                }
            }
        }

        static void ProcessReceipt_CreditCard(AnalyzedDocument document)
        {
            Console.WriteLine($"Document: {document.DocType}");
            if (document.Fields.TryGetValue("MerchantName", out DocumentField? merchantNameField))
            {
                Console.WriteLine($"  MerchantName: Value={merchantNameField.AsString()}   Confidence={merchantNameField.Confidence}");
            }
            if (document.Fields.TryGetValue("MerchantPhoneNumber", out DocumentField? merchantPhoneNumberField))
            {
                Console.WriteLine($"  MerchantPhoneNumber: Value={merchantPhoneNumberField.AsPhoneNumber()}   Confidence={merchantPhoneNumberField.Confidence}");
            }
            if (document.Fields.TryGetValue("MerchantAddress", out DocumentField? merchantAddressField))
            {
                Console.WriteLine($"  MerchantAddress: Value={merchantAddressField.AsAddress()}   Confidence={merchantAddressField.Confidence}");
            }
            if (document.Fields.TryGetValue("Total", out DocumentField? totalField))
            {
                Console.WriteLine($"  Total: Value={totalField.AsDouble()}   Confidence={totalField.Confidence}");
            }
            if (document.Fields.TryGetValue("TransactionDate", out DocumentField? transactionDateField))
            {
                Console.WriteLine($"  TransactionDate: Value={transactionDateField.AsDate()}   Confidence={transactionDateField.Confidence}");
            }
            if (document.Fields.TryGetValue("TransactionTime", out DocumentField? transactionTimeField))
            {
                Console.WriteLine($"  TransactionTime: Value={transactionTimeField.AsTime()}   Confidence={transactionTimeField.Confidence}");
            }
            if (document.Fields.TryGetValue("Subtotal", out DocumentField? subtotalField))
            {
                Console.WriteLine($"  Subtotal: Value={subtotalField.AsDouble()}   Confidence={subtotalField.Confidence}");
            }
            if (document.Fields.TryGetValue("TotalTax", out DocumentField? totalTaxField))
            {
                Console.WriteLine($"  TotalTax: Value={totalTaxField.AsDouble()}   Confidence={totalTaxField.Confidence}");
            }
            if (document.Fields.TryGetValue("Tip", out DocumentField? tipField))
            {
                Console.WriteLine($"  Tip: Value={tipField.AsDouble()}   Confidence={tipField.Confidence}");
            }
            if (document.Fields.TryGetValue("Items", out DocumentField? itemsField))
            {
                var index = 0;
                foreach (var item in itemsField.AsList())
                {
                    var itemFields = item.AsDictionary();
                    if (itemFields.TryGetValue("TotalPrice", out DocumentField? totalPriceField))
                    {
                        Console.WriteLine($"  Items[{index}].TotalPrice: Value={totalPriceField.AsDouble()}   Confidence={totalPriceField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Description", out DocumentField? descriptionField))
                    {
                        Console.WriteLine($"  Items[{index}].Description: Value={descriptionField.AsString()}   Confidence={descriptionField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Quantity", out DocumentField? quantityField))
                    {
                        Console.WriteLine($"  Items[{index}].Quantity: Value={quantityField.AsDouble()}   Confidence={quantityField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Price", out DocumentField? priceField))
                    {
                        Console.WriteLine($"  Items[{index}].Price: Value={priceField.AsDouble()}   Confidence={priceField.Confidence}");
                    }
                    index++;
                }
            }
        }

        static void ProcessReceipt_Gas(AnalyzedDocument document)
        {
            Console.WriteLine($"Document: {document.DocType}");
            if (document.Fields.TryGetValue("MerchantName", out DocumentField? merchantNameField))
            {
                Console.WriteLine($"  MerchantName: Value={merchantNameField.AsString()}   Confidence={merchantNameField.Confidence}");
            }
            if (document.Fields.TryGetValue("MerchantPhoneNumber", out DocumentField? merchantPhoneNumberField))
            {
                Console.WriteLine($"  MerchantPhoneNumber: Value={merchantPhoneNumberField.AsPhoneNumber()}   Confidence={merchantPhoneNumberField.Confidence}");
            }
            if (document.Fields.TryGetValue("MerchantAddress", out DocumentField? merchantAddressField))
            {
                Console.WriteLine($"  MerchantAddress: Value={merchantAddressField.AsAddress()}   Confidence={merchantAddressField.Confidence}");
            }
            if (document.Fields.TryGetValue("Total", out DocumentField? totalField))
            {
                Console.WriteLine($"  Total: Value={totalField.AsDouble()}   Confidence={totalField.Confidence}");
            }
            if (document.Fields.TryGetValue("TransactionDate", out DocumentField? transactionDateField))
            {
                Console.WriteLine($"  TransactionDate: Value={transactionDateField.AsDate()}   Confidence={transactionDateField.Confidence}");
            }
            if (document.Fields.TryGetValue("TransactionTime", out DocumentField? transactionTimeField))
            {
                Console.WriteLine($"  TransactionTime: Value={transactionTimeField.AsTime()}   Confidence={transactionTimeField.Confidence}");
            }
            if (document.Fields.TryGetValue("Subtotal", out DocumentField? subtotalField))
            {
                Console.WriteLine($"  Subtotal: Value={subtotalField.AsDouble()}   Confidence={subtotalField.Confidence}");
            }
            if (document.Fields.TryGetValue("TotalTax", out DocumentField? totalTaxField))
            {
                Console.WriteLine($"  TotalTax: Value={totalTaxField.AsDouble()}   Confidence={totalTaxField.Confidence}");
            }
            if (document.Fields.TryGetValue("Tip", out DocumentField? tipField))
            {
                Console.WriteLine($"  Tip: Value={tipField.AsDouble()}   Confidence={tipField.Confidence}");
            }
            if (document.Fields.TryGetValue("Items", out DocumentField? itemsField))
            {
                var index = 0;
                foreach (var item in itemsField.AsList())
                {
                    var itemFields = item.AsDictionary();
                    if (itemFields.TryGetValue("TotalPrice", out DocumentField? totalPriceField))
                    {
                        Console.WriteLine($"  Items[{index}].TotalPrice: Value={totalPriceField.AsDouble()}   Confidence={totalPriceField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Description", out DocumentField? descriptionField))
                    {
                        Console.WriteLine($"  Items[{index}].Description: Value={descriptionField.AsString()}   Confidence={descriptionField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Quantity", out DocumentField? quantityField))
                    {
                        Console.WriteLine($"  Items[{index}].Quantity: Value={quantityField.AsDouble()}   Confidence={quantityField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Price", out DocumentField? priceField))
                    {
                        Console.WriteLine($"  Items[{index}].Price: Value={priceField.AsDouble()}   Confidence={priceField.Confidence}");
                    }
                    index++;
                }
            }
        }

        static void ProcessReceipt_Parking(AnalyzedDocument document)
        {
            Console.WriteLine($"Document: {document.DocType}");
            if (document.Fields.TryGetValue("MerchantName", out DocumentField? merchantNameField))
            {
                Console.WriteLine($"  MerchantName: Value={merchantNameField.AsString()}   Confidence={merchantNameField.Confidence}");
            }
            if (document.Fields.TryGetValue("MerchantPhoneNumber", out DocumentField? merchantPhoneNumberField))
            {
                Console.WriteLine($"  MerchantPhoneNumber: Value={merchantPhoneNumberField.AsPhoneNumber()}   Confidence={merchantPhoneNumberField.Confidence}");
            }
            if (document.Fields.TryGetValue("MerchantAddress", out DocumentField? merchantAddressField))
            {
                Console.WriteLine($"  MerchantAddress: Value={merchantAddressField.AsAddress()}   Confidence={merchantAddressField.Confidence}");
            }
            if (document.Fields.TryGetValue("Total", out DocumentField? totalField))
            {
                Console.WriteLine($"  Total: Value={totalField.AsDouble()}   Confidence={totalField.Confidence}");
            }
            if (document.Fields.TryGetValue("TransactionDate", out DocumentField? transactionDateField))
            {
                Console.WriteLine($"  TransactionDate: Value={transactionDateField.AsDate()}   Confidence={transactionDateField.Confidence}");
            }
            if (document.Fields.TryGetValue("TransactionTime", out DocumentField? transactionTimeField))
            {
                Console.WriteLine($"  TransactionTime: Value={transactionTimeField.AsTime()}   Confidence={transactionTimeField.Confidence}");
            }
            if (document.Fields.TryGetValue("Subtotal", out DocumentField? subtotalField))
            {
                Console.WriteLine($"  Subtotal: Value={subtotalField.AsDouble()}   Confidence={subtotalField.Confidence}");
            }
            if (document.Fields.TryGetValue("TotalTax", out DocumentField? totalTaxField))
            {
                Console.WriteLine($"  TotalTax: Value={totalTaxField.AsDouble()}   Confidence={totalTaxField.Confidence}");
            }
            if (document.Fields.TryGetValue("Tip", out DocumentField? tipField))
            {
                Console.WriteLine($"  Tip: Value={tipField.AsDouble()}   Confidence={tipField.Confidence}");
            }
            if (document.Fields.TryGetValue("Items", out DocumentField? itemsField))
            {
                var index = 0;
                foreach (var item in itemsField.AsList())
                {
                    var itemFields = item.AsDictionary();
                    if (itemFields.TryGetValue("TotalPrice", out DocumentField? totalPriceField))
                    {
                        Console.WriteLine($"  Items[{index}].TotalPrice: Value={totalPriceField.AsDouble()}   Confidence={totalPriceField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Description", out DocumentField? descriptionField))
                    {
                        Console.WriteLine($"  Items[{index}].Description: Value={descriptionField.AsString()}   Confidence={descriptionField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Quantity", out DocumentField? quantityField))
                    {
                        Console.WriteLine($"  Items[{index}].Quantity: Value={quantityField.AsDouble()}   Confidence={quantityField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Price", out DocumentField? priceField))
                    {
                        Console.WriteLine($"  Items[{index}].Price: Value={priceField.AsDouble()}   Confidence={priceField.Confidence}");
                    }
                    index++;
                }
            }
        }

        static void ProcessReceipt_Hotel(AnalyzedDocument document)
        {
            Console.WriteLine($"Document: {document.DocType}");
            if (document.Fields.TryGetValue("MerchantName", out DocumentField? merchantNameField))
            {
                Console.WriteLine($"  MerchantName: Value={merchantNameField.AsString()}   Confidence={merchantNameField.Confidence}");
            }
            if (document.Fields.TryGetValue("MerchantPhoneNumber", out DocumentField? merchantPhoneNumberField))
            {
                Console.WriteLine($"  MerchantPhoneNumber: Value={merchantPhoneNumberField.AsPhoneNumber()}   Confidence={merchantPhoneNumberField.Confidence}");
            }
            if (document.Fields.TryGetValue("MerchantAddress", out DocumentField? merchantAddressField))
            {
                Console.WriteLine($"  MerchantAddress: Value={merchantAddressField.AsAddress()}   Confidence={merchantAddressField.Confidence}");
            }
            if (document.Fields.TryGetValue("Total", out DocumentField? totalField))
            {
                Console.WriteLine($"  Total: Value={totalField.AsDouble()}   Confidence={totalField.Confidence}");
            }
            if (document.Fields.TryGetValue("ArrivalDate", out DocumentField? arrivalDateField))
            {
                Console.WriteLine($"  ArrivalDate: Value={arrivalDateField.AsDate()}   Confidence={arrivalDateField.Confidence}");
            }
            if (document.Fields.TryGetValue("DepartureDate", out DocumentField? departureDateField))
            {
                Console.WriteLine($"  DepartureDate: Value={departureDateField.AsDate()}   Confidence={departureDateField.Confidence}");
            }
            if (document.Fields.TryGetValue("Currency", out DocumentField? currencyField))
            {
                Console.WriteLine($"  Currency: Value={currencyField.AsString()}   Confidence={currencyField.Confidence}");
            }
            if (document.Fields.TryGetValue("MerchantAliases", out DocumentField? merchantAliasesField))
            {
                var index = 0;
                foreach (var item in merchantAliasesField.AsList())
                {
                    Console.WriteLine($"  MerchantAliases[{index}]: Value={item.AsString()}   Confidence={item.Confidence}");
                    index++;
                }
            }
            if (document.Fields.TryGetValue("Items", out DocumentField? itemsField))
            {
                var index = 0;
                foreach (var item in itemsField.AsList())
                {
                    var itemFields = item.AsDictionary();
                    if (itemFields.TryGetValue("TotalPrice", out DocumentField? totalPriceField))
                    {
                        Console.WriteLine($"  Items[{index}].TotalPrice: Value={totalPriceField.AsDouble()}   Confidence={totalPriceField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Description", out DocumentField? descriptionField))
                    {
                        Console.WriteLine($"  Items[{index}].Description: Value={descriptionField.AsString()}   Confidence={descriptionField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Date", out DocumentField? dateField))
                    {
                        Console.WriteLine($"  Items[{index}].Date: Value={dateField.AsDate()}   Confidence={dateField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Category", out DocumentField? categoryField))
                    {
                        Console.WriteLine($"  Items[{index}].Category: Value={categoryField.AsString()}   Confidence={categoryField.Confidence}");
                    }
                    index++;
                }
            }
        }
    }
}