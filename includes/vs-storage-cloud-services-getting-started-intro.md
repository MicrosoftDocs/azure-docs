###<span id="whathappened">What happened to my project?</span>

###### References Added

The Azure Storage NuGet package was added to your Visual Studio project.  
This package adds the following .NET references:

- `Microsoft.Data.Edm`
- `Microsoft.Data.OData`
- `Microsoft.Data.Services.Client`
- `Microsoft.WindowsAzure.Configuration`
- `Microsoft.WindowsAzure.Storage`
- `Newtonsoft.Json`
- `System.Data`
- `System.Spatial`

######Connection string for Azure Storage added 
Elements were created with the selected storage account's connection string and key. Modifications were made to the following files:

- ServiceDefinition.csdef
- ServiceConfiguration.Cloud.cscfg
- ServiceConfiguration.Local.cscfg

