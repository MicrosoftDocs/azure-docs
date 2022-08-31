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
            var modelId = "prebuilt-tax.us.w2";

            var client = new DocumentAnalysisClient(new Uri(endpoint), new AzureKeyCredential(key));
            var operation = client.StartAnalyzeDocumentFromUri(modelId, new Uri(documentUrl));
            var result = operation.WaitForCompletion().Value;
            foreach (var document in result.Documents)
            {
                switch (document.DocType)
                {
                    case "tax.us.w2": ProcessTax_Us_W2(document); break;
                }
            }
        }

        static void ProcessTax_Us_W2(AnalyzedDocument document)
        {
            Console.WriteLine($"Document: {document.DocType}");
            if (document.Fields.TryGetValue("W2FormVariant", out DocumentField? w2FormVariantField))
            {
                Console.WriteLine($"  W2FormVariant: Value={w2FormVariantField.AsString()}   Confidence={w2FormVariantField.Confidence}");
            }
            if (document.Fields.TryGetValue("TaxYear", out DocumentField? taxYearField))
            {
                Console.WriteLine($"  TaxYear: Value={taxYearField.AsString()}   Confidence={taxYearField.Confidence}");
            }
            if (document.Fields.TryGetValue("W2Copy", out DocumentField? w2CopyField))
            {
                Console.WriteLine($"  W2Copy: Value={w2CopyField.AsString()}   Confidence={w2CopyField.Confidence}");
            }
            if (document.Fields.TryGetValue("Employee", out DocumentField? employeeField))
            {
                var employeeFieldFields = employeeField.AsDictionary();
                if (employeeFieldFields.TryGetValue("SocialSecurityNumber", out DocumentField? socialSecurityNumberField))
                {
                    Console.WriteLine($"  Employee.SocialSecurityNumber: Value={socialSecurityNumberField.AsString()}   Confidence={socialSecurityNumberField.Confidence}");
                }
                if (employeeFieldFields.TryGetValue("Name", out DocumentField? nameField))
                {
                    Console.WriteLine($"  Employee.Name: Value={nameField.AsString()}   Confidence={nameField.Confidence}");
                }
                if (employeeFieldFields.TryGetValue("Address", out DocumentField? addressField))
                {
                    Console.WriteLine($"  Employee.Address: Value={addressField.AsAddress()}   Confidence={addressField.Confidence}");
                }
            }
            if (document.Fields.TryGetValue("ControlNumber", out DocumentField? controlNumberField))
            {
                Console.WriteLine($"  ControlNumber: Value={controlNumberField.AsString()}   Confidence={controlNumberField.Confidence}");
            }
            if (document.Fields.TryGetValue("Employer", out DocumentField? employerField))
            {
                var employerFieldFields = employerField.AsDictionary();
                if (employerFieldFields.TryGetValue("IdNumber", out DocumentField? idNumberField))
                {
                    Console.WriteLine($"  Employer.IdNumber: Value={idNumberField.AsString()}   Confidence={idNumberField.Confidence}");
                }
                if (employerFieldFields.TryGetValue("Name", out DocumentField? nameField))
                {
                    Console.WriteLine($"  Employer.Name: Value={nameField.AsString()}   Confidence={nameField.Confidence}");
                }
                if (employerFieldFields.TryGetValue("Address", out DocumentField? addressField))
                {
                    Console.WriteLine($"  Employer.Address: Value={addressField.AsAddress()}   Confidence={addressField.Confidence}");
                }
            }
            if (document.Fields.TryGetValue("WagesTipsAndOtherCompensation", out DocumentField? wagesTipsAndOtherCompensationField))
            {
                Console.WriteLine($"  WagesTipsAndOtherCompensation: Value={wagesTipsAndOtherCompensationField.AsDouble()}   Confidence={wagesTipsAndOtherCompensationField.Confidence}");
            }
            if (document.Fields.TryGetValue("FederalIncomeTaxWithheld", out DocumentField? federalIncomeTaxWithheldField))
            {
                Console.WriteLine($"  FederalIncomeTaxWithheld: Value={federalIncomeTaxWithheldField.AsDouble()}   Confidence={federalIncomeTaxWithheldField.Confidence}");
            }
            if (document.Fields.TryGetValue("SocialSecurityWages", out DocumentField? socialSecurityWagesField))
            {
                Console.WriteLine($"  SocialSecurityWages: Value={socialSecurityWagesField.AsDouble()}   Confidence={socialSecurityWagesField.Confidence}");
            }
            if (document.Fields.TryGetValue("SocialSecurityTaxWithheld", out DocumentField? socialSecurityTaxWithheldField))
            {
                Console.WriteLine($"  SocialSecurityTaxWithheld: Value={socialSecurityTaxWithheldField.AsDouble()}   Confidence={socialSecurityTaxWithheldField.Confidence}");
            }
            if (document.Fields.TryGetValue("MedicareWagesAndTips", out DocumentField? medicareWagesAndTipsField))
            {
                Console.WriteLine($"  MedicareWagesAndTips: Value={medicareWagesAndTipsField.AsDouble()}   Confidence={medicareWagesAndTipsField.Confidence}");
            }
            if (document.Fields.TryGetValue("MedicareTaxWithheld", out DocumentField? medicareTaxWithheldField))
            {
                Console.WriteLine($"  MedicareTaxWithheld: Value={medicareTaxWithheldField.AsDouble()}   Confidence={medicareTaxWithheldField.Confidence}");
            }
            if (document.Fields.TryGetValue("SocialSecurityTips", out DocumentField? socialSecurityTipsField))
            {
                Console.WriteLine($"  SocialSecurityTips: Value={socialSecurityTipsField.AsDouble()}   Confidence={socialSecurityTipsField.Confidence}");
            }
            if (document.Fields.TryGetValue("AllocatedTips", out DocumentField? allocatedTipsField))
            {
                Console.WriteLine($"  AllocatedTips: Value={allocatedTipsField.AsDouble()}   Confidence={allocatedTipsField.Confidence}");
            }
            if (document.Fields.TryGetValue("VerificationCode", out DocumentField? verificationCodeField))
            {
                Console.WriteLine($"  VerificationCode: Value={verificationCodeField.AsString()}   Confidence={verificationCodeField.Confidence}");
            }
            if (document.Fields.TryGetValue("DependentCareBenefits", out DocumentField? dependentCareBenefitsField))
            {
                Console.WriteLine($"  DependentCareBenefits: Value={dependentCareBenefitsField.AsDouble()}   Confidence={dependentCareBenefitsField.Confidence}");
            }
            if (document.Fields.TryGetValue("NonQualifiedPlans", out DocumentField? nonQualifiedPlansField))
            {
                Console.WriteLine($"  NonQualifiedPlans: Value={nonQualifiedPlansField.AsDouble()}   Confidence={nonQualifiedPlansField.Confidence}");
            }
            if (document.Fields.TryGetValue("AdditionalInfo", out DocumentField? additionalInfoField))
            {
                var index = 0;
                foreach (var item in additionalInfoField.AsList())
                {
                    var itemFields = item.AsDictionary();
                    if (itemFields.TryGetValue("LetterCode", out DocumentField? letterCodeField))
                    {
                        Console.WriteLine($"  AdditionalInfo[{index}].LetterCode: Value={letterCodeField.AsString()}   Confidence={letterCodeField.Confidence}");
                    }
                    if (itemFields.TryGetValue("Amount", out DocumentField? amountField))
                    {
                        Console.WriteLine($"  AdditionalInfo[{index}].Amount: Value={amountField.AsDouble()}   Confidence={amountField.Confidence}");
                    }
                    index++;
                }
            }
            if (document.Fields.TryGetValue("IsStatutoryEmployee", out DocumentField? isStatutoryEmployeeField))
            {
                Console.WriteLine($"  IsStatutoryEmployee: Value={isStatutoryEmployeeField.AsString()}   Confidence={isStatutoryEmployeeField.Confidence}");
            }
            if (document.Fields.TryGetValue("IsRetirementPlan", out DocumentField? isRetirementPlanField))
            {
                Console.WriteLine($"  IsRetirementPlan: Value={isRetirementPlanField.AsString()}   Confidence={isRetirementPlanField.Confidence}");
            }
            if (document.Fields.TryGetValue("IsThirdPartySickPay", out DocumentField? isThirdPartySickPayField))
            {
                Console.WriteLine($"  IsThirdPartySickPay: Value={isThirdPartySickPayField.AsString()}   Confidence={isThirdPartySickPayField.Confidence}");
            }
            if (document.Fields.TryGetValue("Other", out DocumentField? otherField))
            {
                Console.WriteLine($"  Other: Value={otherField.AsString()}   Confidence={otherField.Confidence}");
            }
            if (document.Fields.TryGetValue("StateTaxInfos", out DocumentField? stateTaxInfosField))
            {
                var index = 0;
                foreach (var item in stateTaxInfosField.AsList())
                {
                    var itemFields = item.AsDictionary();
                    if (itemFields.TryGetValue("State", out DocumentField? stateField))
                    {
                        Console.WriteLine($"  StateTaxInfos[{index}].State: Value={stateField.AsString()}   Confidence={stateField.Confidence}");
                    }
                    if (itemFields.TryGetValue("EmployerStateIdNumber", out DocumentField? employerStateIdNumberField))
                    {
                        Console.WriteLine($"  StateTaxInfos[{index}].EmployerStateIdNumber: Value={employerStateIdNumberField.AsString()}   Confidence={employerStateIdNumberField.Confidence}");
                    }
                    if (itemFields.TryGetValue("StateWagesTipsEtc", out DocumentField? stateWagesTipsEtcField))
                    {
                        Console.WriteLine($"  StateTaxInfos[{index}].StateWagesTipsEtc: Value={stateWagesTipsEtcField.AsDouble()}   Confidence={stateWagesTipsEtcField.Confidence}");
                    }
                    if (itemFields.TryGetValue("StateIncomeTax", out DocumentField? stateIncomeTaxField))
                    {
                        Console.WriteLine($"  StateTaxInfos[{index}].StateIncomeTax: Value={stateIncomeTaxField.AsDouble()}   Confidence={stateIncomeTaxField.Confidence}");
                    }
                    index++;
                }
            }
            if (document.Fields.TryGetValue("LocalTaxInfos", out DocumentField? localTaxInfosField))
            {
                var index = 0;
                foreach (var item in localTaxInfosField.AsList())
                {
                    var itemFields = item.AsDictionary();
                    if (itemFields.TryGetValue("LocalWagesTipsEtc", out DocumentField? localWagesTipsEtcField))
                    {
                        Console.WriteLine($"  LocalTaxInfos[{index}].LocalWagesTipsEtc: Value={localWagesTipsEtcField.AsDouble()}   Confidence={localWagesTipsEtcField.Confidence}");
                    }
                    if (itemFields.TryGetValue("LocalIncomeTax", out DocumentField? localIncomeTaxField))
                    {
                        Console.WriteLine($"  LocalTaxInfos[{index}].LocalIncomeTax: Value={localIncomeTaxField.AsDouble()}   Confidence={localIncomeTaxField.Confidence}");
                    }
                    if (itemFields.TryGetValue("LocalityName", out DocumentField? localityNameField))
                    {
                        Console.WriteLine($"  LocalTaxInfos[{index}].LocalityName: Value={localityNameField.AsString()}   Confidence={localityNameField.Confidence}");
                    }
                    index++;
                }
            }
        }
    }
}