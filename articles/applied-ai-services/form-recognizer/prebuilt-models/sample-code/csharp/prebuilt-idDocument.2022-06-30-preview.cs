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
            var modelId = "prebuilt-idDocument";

            var client = new DocumentAnalysisClient(new Uri(endpoint), new AzureKeyCredential(key));
            var operation = client.StartAnalyzeDocumentFromUri(modelId, new Uri(documentUrl));
            var result = operation.WaitForCompletion().Value;
            foreach (var document in result.Documents)
            {
                switch (document.DocType)
                {
                    case "idDocument.driverLicense": ProcessIdDocument_DriverLicense(document); break;
                    case "idDocument.passport": ProcessIdDocument_Passport(document); break;
                }
            }
        }

        static void ProcessIdDocument_DriverLicense(AnalyzedDocument document)
        {
            Console.WriteLine($"Document: {document.DocType}");
            if (document.Fields.TryGetValue("CountryRegion", out DocumentField? countryRegionField))
            {
                Console.WriteLine($"  CountryRegion: Value={countryRegionField.AsCountryRegion()}   Confidence={countryRegionField.Confidence}");
            }
            if (document.Fields.TryGetValue("Region", out DocumentField? regionField))
            {
                Console.WriteLine($"  Region: Value={regionField.AsString()}   Confidence={regionField.Confidence}");
            }
            if (document.Fields.TryGetValue("DocumentNumber", out DocumentField? documentNumberField))
            {
                Console.WriteLine($"  DocumentNumber: Value={documentNumberField.AsString()}   Confidence={documentNumberField.Confidence}");
            }
            if (document.Fields.TryGetValue("DocumentDiscriminator", out DocumentField? documentDiscriminatorField))
            {
                Console.WriteLine($"  DocumentDiscriminator: Value={documentDiscriminatorField.AsString()}   Confidence={documentDiscriminatorField.Confidence}");
            }
            if (document.Fields.TryGetValue("FirstName", out DocumentField? firstNameField))
            {
                Console.WriteLine($"  FirstName: Value={firstNameField.AsString()}   Confidence={firstNameField.Confidence}");
            }
            if (document.Fields.TryGetValue("LastName", out DocumentField? lastNameField))
            {
                Console.WriteLine($"  LastName: Value={lastNameField.AsString()}   Confidence={lastNameField.Confidence}");
            }
            if (document.Fields.TryGetValue("Address", out DocumentField? addressField))
            {
                Console.WriteLine($"  Address: Value={addressField.AsString()}   Confidence={addressField.Confidence}");
            }
            if (document.Fields.TryGetValue("DateOfBirth", out DocumentField? dateOfBirthField))
            {
                Console.WriteLine($"  DateOfBirth: Value={dateOfBirthField.AsDate()}   Confidence={dateOfBirthField.Confidence}");
            }
            if (document.Fields.TryGetValue("DateOfExpiration", out DocumentField? dateOfExpirationField))
            {
                Console.WriteLine($"  DateOfExpiration: Value={dateOfExpirationField.AsDate()}   Confidence={dateOfExpirationField.Confidence}");
            }
            if (document.Fields.TryGetValue("DateOfIssue", out DocumentField? dateOfIssueField))
            {
                Console.WriteLine($"  DateOfIssue: Value={dateOfIssueField.AsDate()}   Confidence={dateOfIssueField.Confidence}");
            }
            if (document.Fields.TryGetValue("EyeColor", out DocumentField? eyeColorField))
            {
                Console.WriteLine($"  EyeColor: Value={eyeColorField.AsString()}   Confidence={eyeColorField.Confidence}");
            }
            if (document.Fields.TryGetValue("HairColor", out DocumentField? hairColorField))
            {
                Console.WriteLine($"  HairColor: Value={hairColorField.AsString()}   Confidence={hairColorField.Confidence}");
            }
            if (document.Fields.TryGetValue("Height", out DocumentField? heightField))
            {
                Console.WriteLine($"  Height: Value={heightField.AsString()}   Confidence={heightField.Confidence}");
            }
            if (document.Fields.TryGetValue("Weight", out DocumentField? weightField))
            {
                Console.WriteLine($"  Weight: Value={weightField.AsString()}   Confidence={weightField.Confidence}");
            }
            if (document.Fields.TryGetValue("Sex", out DocumentField? sexField))
            {
                Console.WriteLine($"  Sex: Value={sexField.AsString()}   Confidence={sexField.Confidence}");
            }
            if (document.Fields.TryGetValue("Endorsements", out DocumentField? endorsementsField))
            {
                Console.WriteLine($"  Endorsements: Value={endorsementsField.AsString()}   Confidence={endorsementsField.Confidence}");
            }
            if (document.Fields.TryGetValue("Restrictions", out DocumentField? restrictionsField))
            {
                Console.WriteLine($"  Restrictions: Value={restrictionsField.AsString()}   Confidence={restrictionsField.Confidence}");
            }
            if (document.Fields.TryGetValue("VehicleClassifications", out DocumentField? vehicleClassificationsField))
            {
                Console.WriteLine($"  VehicleClassifications: Value={vehicleClassificationsField.AsString()}   Confidence={vehicleClassificationsField.Confidence}");
            }
        }

        static void ProcessIdDocument_Passport(AnalyzedDocument document)
        {
            Console.WriteLine($"Document: {document.DocType}");
            if (document.Fields.TryGetValue("MachineReadableZone", out DocumentField? machineReadableZoneField))
            {
                var machineReadableZoneFieldFields = machineReadableZoneField.AsDictionary();
                if (machineReadableZoneFieldFields.TryGetValue("FirstName", out DocumentField? firstNameField))
                {
                    Console.WriteLine($"  MachineReadableZone.FirstName: Value={firstNameField.AsString()}   Confidence={firstNameField.Confidence}");
                }
                if (machineReadableZoneFieldFields.TryGetValue("LastName", out DocumentField? lastNameField))
                {
                    Console.WriteLine($"  MachineReadableZone.LastName: Value={lastNameField.AsString()}   Confidence={lastNameField.Confidence}");
                }
                if (machineReadableZoneFieldFields.TryGetValue("DocumentNumber", out DocumentField? documentNumberField))
                {
                    Console.WriteLine($"  MachineReadableZone.DocumentNumber: Value={documentNumberField.AsString()}   Confidence={documentNumberField.Confidence}");
                }
                if (machineReadableZoneFieldFields.TryGetValue("CountryRegion", out DocumentField? countryRegionField))
                {
                    Console.WriteLine($"  MachineReadableZone.CountryRegion: Value={countryRegionField.AsCountryRegion()}   Confidence={countryRegionField.Confidence}");
                }
                if (machineReadableZoneFieldFields.TryGetValue("Nationality", out DocumentField? nationalityField))
                {
                    Console.WriteLine($"  MachineReadableZone.Nationality: Value={nationalityField.AsCountryRegion()}   Confidence={nationalityField.Confidence}");
                }
                if (machineReadableZoneFieldFields.TryGetValue("DateOfBirth", out DocumentField? dateOfBirthField))
                {
                    Console.WriteLine($"  MachineReadableZone.DateOfBirth: Value={dateOfBirthField.AsDate()}   Confidence={dateOfBirthField.Confidence}");
                }
                if (machineReadableZoneFieldFields.TryGetValue("DateOfExpiration", out DocumentField? dateOfExpirationField))
                {
                    Console.WriteLine($"  MachineReadableZone.DateOfExpiration: Value={dateOfExpirationField.AsDate()}   Confidence={dateOfExpirationField.Confidence}");
                }
                if (machineReadableZoneFieldFields.TryGetValue("Sex", out DocumentField? sexField))
                {
                    Console.WriteLine($"  MachineReadableZone.Sex: Value={sexField.AsString()}   Confidence={sexField.Confidence}");
                }
            }
        }
    }
}