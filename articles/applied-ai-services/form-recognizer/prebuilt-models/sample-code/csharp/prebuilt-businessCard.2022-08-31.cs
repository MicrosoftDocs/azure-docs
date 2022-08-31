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
            var modelId = "prebuilt-businessCard";

            var client = new DocumentAnalysisClient(new Uri(endpoint), new AzureKeyCredential(key));
            var operation = client.StartAnalyzeDocumentFromUri(modelId, new Uri(documentUrl));
            var result = operation.WaitForCompletion().Value;
            foreach (var document in result.Documents)
            {
                switch (document.DocType)
                {
                    case "businessCard": ProcessBusinessCard(document); break;
                }
            }
        }

        static void ProcessBusinessCard(AnalyzedDocument document)
        {
            Console.WriteLine($"Document: {document.DocType}");
            if (document.Fields.TryGetValue("ContactNames", out DocumentField? contactNamesField))
            {
                var index = 0;
                foreach (var item in contactNamesField.AsList())
                {
                    var itemFields = item.AsDictionary();
                    if (itemFields.TryGetValue("FirstName", out DocumentField? firstNameField))
                    {
                        Console.WriteLine($"  ContactNames[{index}].FirstName: Value={firstNameField.AsString()}   Confidence={firstNameField.Confidence}");
                    }
                    if (itemFields.TryGetValue("LastName", out DocumentField? lastNameField))
                    {
                        Console.WriteLine($"  ContactNames[{index}].LastName: Value={lastNameField.AsString()}   Confidence={lastNameField.Confidence}");
                    }
                    index++;
                }
            }
            if (document.Fields.TryGetValue("CompanyNames", out DocumentField? companyNamesField))
            {
                var index = 0;
                foreach (var item in companyNamesField.AsList())
                {
                    Console.WriteLine($"  CompanyNames[{index}]: Value={item.AsString()}   Confidence={item.Confidence}");
                    index++;
                }
            }
            if (document.Fields.TryGetValue("JobTitles", out DocumentField? jobTitlesField))
            {
                var index = 0;
                foreach (var item in jobTitlesField.AsList())
                {
                    Console.WriteLine($"  JobTitles[{index}]: Value={item.AsString()}   Confidence={item.Confidence}");
                    index++;
                }
            }
            if (document.Fields.TryGetValue("Departments", out DocumentField? departmentsField))
            {
                var index = 0;
                foreach (var item in departmentsField.AsList())
                {
                    Console.WriteLine($"  Departments[{index}]: Value={item.AsString()}   Confidence={item.Confidence}");
                    index++;
                }
            }
            if (document.Fields.TryGetValue("Addresses", out DocumentField? addressesField))
            {
                var index = 0;
                foreach (var item in addressesField.AsList())
                {
                    Console.WriteLine($"  Addresses[{index}]: Value={item.AsAddress()}   Confidence={item.Confidence}");
                    index++;
                }
            }
            if (document.Fields.TryGetValue("WorkPhones", out DocumentField? workPhonesField))
            {
                var index = 0;
                foreach (var item in workPhonesField.AsList())
                {
                    Console.WriteLine($"  WorkPhones[{index}]: Value={item.AsPhoneNumber()}   Confidence={item.Confidence}");
                    index++;
                }
            }
            if (document.Fields.TryGetValue("MobilePhones", out DocumentField? mobilePhonesField))
            {
                var index = 0;
                foreach (var item in mobilePhonesField.AsList())
                {
                    Console.WriteLine($"  MobilePhones[{index}]: Value={item.AsPhoneNumber()}   Confidence={item.Confidence}");
                    index++;
                }
            }
            if (document.Fields.TryGetValue("Faxes", out DocumentField? faxesField))
            {
                var index = 0;
                foreach (var item in faxesField.AsList())
                {
                    Console.WriteLine($"  Faxes[{index}]: Value={item.AsPhoneNumber()}   Confidence={item.Confidence}");
                    index++;
                }
            }
            if (document.Fields.TryGetValue("OtherPhones", out DocumentField? otherPhonesField))
            {
                var index = 0;
                foreach (var item in otherPhonesField.AsList())
                {
                    Console.WriteLine($"  OtherPhones[{index}]: Value={item.AsPhoneNumber()}   Confidence={item.Confidence}");
                    index++;
                }
            }
            if (document.Fields.TryGetValue("Emails", out DocumentField? emailsField))
            {
                var index = 0;
                foreach (var item in emailsField.AsList())
                {
                    Console.WriteLine($"  Emails[{index}]: Value={item.AsString()}   Confidence={item.Confidence}");
                    index++;
                }
            }
            if (document.Fields.TryGetValue("Websites", out DocumentField? websitesField))
            {
                var index = 0;
                foreach (var item in websitesField.AsList())
                {
                    Console.WriteLine($"  Websites[{index}]: Value={item.AsString()}   Confidence={item.Confidence}");
                    index++;
                }
            }
        }
    }
}