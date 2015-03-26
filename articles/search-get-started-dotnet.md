<properties 
	pageTitle="Get started with your first Azure Search application in .NET" 
	description="Tutorial on how to build a Visual Studio solution using the .NET client library from the Azure Search .NET SDK." 
	services="search" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="mblythe" 
	editor=""/>

<tags 
	ms.service="search" 
	ms.devlang="rest-api" 
	ms.workload="search" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.date="03/25/2015" 
	ms.author="heidist"/>

#Get started with your first Azure Search application in .NET#

Learn how to build a custom .NET search application in Visual Studio 2013 or later that uses Azure Search for its search experience. The tutorial utilizes the [Azure Search .NET SDK](search-howto-dotnet-sdk.md) to build classes for the objects and operations used in this exercise.

To run this sample, you must have an Azure Search service, which you can sign up for in the [Azure management portal](https://portal.azure.com). 

> [AZURE.TIP] You can download a copy of the finished sample code at [Azure Search Demo Using USGS Data](http://go.microsoft.com/fwlink/p/?LinkId=530196). 

##About the data##

This sample application uses data from the [United States Geological Services (USGS)](http://geonames.usgs.gov/domestic/download_data.htm), filtered on the state of Washington to reduce the dataset size. We'll use this data to build a search application that returns landmark buildings such as hospitals and schools, as well as geological features like streams, lakes, and summits.

> [AZURE.NOTE] We applied a filter on this dataset to stay under the 50 MB index size limit of the free pricing tier. If you use the standard tier, this limit does not apply. For details about capacity for each pricing tier, see [Limits and constraints](https://msdn.microsoft.com/library/azure/dn798934.aspx).

##Create the service##

1. Sign in to [Azure Preview portal](https://portal.azure.com).

2. In the Jumpbar, click **New** | **Data + storage** | **Search**.
 
     ![][1]

3. Configure the service name, pricing tier, resource group, subscription and location. These settings are required and cannot be changed once the service is provisioned.

     ![][2]

	- **Service name** must be unique, lower-case, under 15 characters, with no spaces. This name becomes part of the endpoint of your Azure Search service. See [Naming Rules](https://msdn.microsoft.com/library/azure/dn857353.aspx) for more information about naming conventions. 
	
	- **Pricing Tier** determines capacity and billing. Both tiers provide the same features, but at different resource levels. 
	
		- **Free**  runs on clusters that are shared with other subscribers. It offers enough capacity to try out tutorials and write proof-of-concept code, but is not intended for production applications. Deploying a free service typically only takes a few minutes.
		- **Standard** runs on dedicated resources and is highly scalable. Initially, a standard service is provisioned with one replica and one partition, but you can adjust capacity once the service is created. Deploying a standard service takes longer, usually about fifteen minutes.
	
	- **Resource Groups** are containers for services and resources used for a common purpose. For example, if you're building a custom search application based on Azure Search, Azure Websites, Azure BLOB storage, you could create a resource group that keeps these services together in the portal management pages.
	
	- **Subscription** allows you to choose among multiple subscriptions, if you have more than one subscription.
	
	- **Location** is the data center region. Currently, all resources must run in the same data center. Distributing resources across multiple data centers is not supported.

4. Click **Create** to provision the service. 

Watch for notifications in the Jumpbar. A notice will appear when the service is ready to use.

<a id="sub-2"></a>
##Find the service name and api-keys of your Azure Search service

After the service is created, you can return to the portal to get the URL or `api-key`. Connections to your Search service requires that you have both the URL and an `api-key` to authenticate the call. 

1. In the Jumpbar, click **Home** and then click the Search service to open the service dashboard. 

2. On the service dashboard, you'll see tiles for essential information, as well as the key icon for accessing the admin keys.

  	![][3]

3. Copy the service URL and an admin key. You will need them later, when you add them to the app.config and web.config files in your Visual Studio projects.

##Start a new project and solution##

This solution will include two projects: **DataIndexer** for loading data, and **SimpleSearchMVCApp** for querying and presenting search results. In this step, you'll create both projects.

1. Start **Visual Studio** | **New Project** | **Visual C#** | **Windows Desktop** | **Console Application**. 
2. Name the project "DataIndexexer" and then name the solution "AzureSearchDotNetDemo".
3. In Solution Explorer, on solution, right-click **Add** | **New Project** | **Visual C#** | **Web** | **Visual Studio 2012** | **ASP.NET MVC 4 Web application**. 
4. Name the project "SimpleSearchMVCApp".

Your solution should look similar to the example shown below.

![][4]

##Update configuration files

1. Replace App.config with the following example, updating the [SERVICE NAME] and [SERVICE KEY] with values that are valid for your service. The service name is not the full URL. For example, if your Search service endpoint is https://mysearchsrv.search.microsoft.net, the service name you would enter in App.config is "mysearchsrv".

	    <?xml version="1.0" encoding="utf-8"?>
	    <configuration>
	      <startup> 
	         <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5" />
	      </startup>
	      <appSettings>
	        <add key="SearchServiceName" value="[SERVICE NAME]" />
	        <add key="SearchServiceApiKey" value="[SERVICE KEY]" />
	      </appSettings>
	    </configuration>

2. Replace Web.config in SimpleSearchMVCApp with the following example, again updating [SERVICE NAME] and [SERVICE KEY] with values that are valid for your service.
		
		<?xml version="1.0" encoding="utf-8"?>
		<!--
		  For more information on how to configure your ASP.NET application, please visit
		  http://go.microsoft.com/fwlink/?LinkId=152368
		  -->
		<configuration>
		  <configSections>
		    <!-- For more information on Entity Framework configuration, visit http://go.microsoft.com/fwlink/?LinkID=237468 -->
		    <section name="entityFramework" type="System.Data.Entity.Internal.ConfigFile.EntityFrameworkSection, EntityFramework, Version=5.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089" requirePermission="false" />
		  </configSections>
		  <connectionStrings>
		    <add name="DefaultConnection" providerName="System.Data.SqlClient" connectionString="Data Source=(LocalDb)\v11.0;Initial Catalog=aspnet-SimpleMVCApp-20150303114355;Integrated Security=SSPI;AttachDBFilename=|DataDirectory|\aspnet-SimpleMVCApp-20150303114355.mdf" />
		  </connectionStrings>
		  <appSettings>
		    <add key="SearchServiceName" value="[SERVICE NAME]" />
		    <add key="SearchServiceApiKey" value="[SERVICE KEY]" />

		    <add key="webpages:Version" value="2.0.0.0" />
		    <add key="webpages:Enabled" value="false" />
		    <add key="PreserveLoginUrl" value="true" />
		    <add key="ClientValidationEnabled" value="true" />
		    <add key="UnobtrusiveJavaScriptEnabled" value="true" />
		  </appSettings>
		  <system.web>
		    <httpRuntime targetFramework="4.5" />
		    <compilation debug="true" targetFramework="4.5" />
		    <authentication mode="Forms">
		      <forms loginUrl="~/Account/Login" timeout="2880" />
		    </authentication>
		    <pages>
		      <namespaces>
		        <add namespace="System.Web.Helpers" />
		        <add namespace="System.Web.Mvc" />
		        <add namespace="System.Web.Mvc.Ajax" />
		        <add namespace="System.Web.Mvc.Html" />
		        <add namespace="System.Web.Optimization" />
		        <add namespace="System.Web.Routing" />
		        <add namespace="System.Web.WebPages" />
		      </namespaces>
		    </pages>
		    <profile defaultProvider="DefaultProfileProvider">
		      <providers>
		        <add name="DefaultProfileProvider" type="System.Web.Providers.DefaultProfileProvider, System.Web.Providers, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" connectionStringName="DefaultConnection" applicationName="/" />
		      </providers>
		    </profile>
		    <membership defaultProvider="DefaultMembershipProvider">
		      <providers>
		        <add name="DefaultMembershipProvider" type="System.Web.Providers.DefaultMembershipProvider, System.Web.Providers, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" connectionStringName="DefaultConnection" enablePasswordRetrieval="false" enablePasswordReset="true" requiresQuestionAndAnswer="false" requiresUniqueEmail="false" maxInvalidPasswordAttempts="5" minRequiredPasswordLength="6" minRequiredNonalphanumericCharacters="0" passwordAttemptWindow="10" applicationName="/" />
		      </providers>
		    </membership>
		    <roleManager defaultProvider="DefaultRoleProvider">
		      <providers>
		        <add name="DefaultRoleProvider" type="System.Web.Providers.DefaultRoleProvider, System.Web.Providers, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" connectionStringName="DefaultConnection" applicationName="/" />
		      </providers>
		    </roleManager>
		    <!--
		            If you are deploying to a cloud environment that has multiple web server instances,
		            you should change session state mode from "InProc" to "Custom". In addition,
		            change the connection string named "DefaultConnection" to connect to an instance
		            of SQL Server (including SQL Azure and SQL  Compact) instead of to SQL Server Express.
		      -->
		    <sessionState mode="InProc" customProvider="DefaultSessionProvider">
		      <providers>
		        <add name="DefaultSessionProvider" type="System.Web.Providers.DefaultSessionStateProvider, System.Web.Providers, Version=1.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35" connectionStringName="DefaultConnection" />
		      </providers>
		    </sessionState>
		  </system.web>
		  <system.webServer>
		    <validation validateIntegratedModeConfiguration="false" />
		    <handlers>
		      <remove name="ExtensionlessUrlHandler-ISAPI-4.0_32bit" />
		      <remove name="ExtensionlessUrlHandler-ISAPI-4.0_64bit" />
		      <remove name="ExtensionlessUrlHandler-Integrated-4.0" />
		      <add name="ExtensionlessUrlHandler-ISAPI-4.0_32bit" path="*." verb="GET,HEAD,POST,DEBUG,PUT,DELETE,PATCH,OPTIONS" modules="IsapiModule" scriptProcessor="%windir%\Microsoft.NET\Framework\v4.0.30319\aspnet_isapi.dll" preCondition="classicMode,runtimeVersionv4.0,bitness32" responseBufferLimit="0" />
		      <add name="ExtensionlessUrlHandler-ISAPI-4.0_64bit" path="*." verb="GET,HEAD,POST,DEBUG,PUT,DELETE,PATCH,OPTIONS" modules="IsapiModule" scriptProcessor="%windir%\Microsoft.NET\Framework64\v4.0.30319\aspnet_isapi.dll" preCondition="classicMode,runtimeVersionv4.0,bitness64" responseBufferLimit="0" />
		      <add name="ExtensionlessUrlHandler-Integrated-4.0" path="*." verb="GET,HEAD,POST,DEBUG,PUT,DELETE,PATCH,OPTIONS" type="System.Web.Handlers.TransferRequestHandler" preCondition="integratedMode,runtimeVersionv4.0" />
		      <remove name="OPTIONSVerbHandler" />
		      <remove name="TRACEVerbHandler" />
		    </handlers>
		  </system.webServer>
		  <entityFramework>
		    <defaultConnectionFactory type="System.Data.Entity.Infrastructure.LocalDbConnectionFactory, EntityFramework">
		      <parameters>
		        <parameter value="v12.0" />
		      </parameters>
		    </defaultConnectionFactory>
		  </entityFramework>
		  <runtime>
		    <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
		      <dependentAssembly>
		        <assemblyIdentity name="Newtonsoft.Json" publicKeyToken="30ad4fe6b2a6aeed" culture="neutral" />
		        <bindingRedirect oldVersion="0.0.0.0-6.0.0.0" newVersion="6.0.0.0" />
		      </dependentAssembly>
		      <dependentAssembly>
		        <assemblyIdentity name="WebGrease" publicKeyToken="31bf3856ad364e35" culture="neutral" />
		        <bindingRedirect oldVersion="0.0.0.0-1.6.5135.21930" newVersion="1.6.5135.21930" />
		      </dependentAssembly>
		      <dependentAssembly>
		        <assemblyIdentity name="Antlr3.Runtime" publicKeyToken="eb42632606e9261f" culture="neutral" />
		        <bindingRedirect oldVersion="0.0.0.0-3.5.0.2" newVersion="3.5.0.2" />
		      </dependentAssembly>
		      <dependentAssembly>
		        <assemblyIdentity name="System.Web.Helpers" publicKeyToken="31bf3856ad364e35" />
		        <bindingRedirect oldVersion="1.0.0.0-3.0.0.0" newVersion="3.0.0.0" />
		      </dependentAssembly>
		      <dependentAssembly>
		        <assemblyIdentity name="System.Web.WebPages" publicKeyToken="31bf3856ad364e35" />
		        <bindingRedirect oldVersion="1.0.0.0-3.0.0.0" newVersion="3.0.0.0" />
		      </dependentAssembly>
		      <dependentAssembly>
        <assemblyIdentity name="System.Web.Mvc" publicKeyToken="31bf3856ad364e35" />
        <bindingRedirect oldVersion="1.0.0.0-5.2.3.0" newVersion="5.2.3.0" />
      </dependentAssembly>
      <dependentAssembly>
        <assemblyIdentity name="System.Web.WebPages.Razor" publicKeyToken="31bf3856ad364e35" />
        <bindingRedirect oldVersion="1.0.0.0-3.0.0.0" newVersion="3.0.0.0" />
      </dependentAssembly>
    </assemblyBinding>
	  </runtime>
	</configuration>

##Install the .NET SDK and other packages

1. Go to [Nuget.org](http://www.nuget.org/packages/Microsoft.Azure.Search) to download the client library, or right-click **Manage NuGet Packages** on the solution in Solution Explorer. Be sure to specify the search correctly or you won't easily find the package:
 
- Online | nuget.org
- Include Prerelease in the filter
- search term should be azure.search or microsoft.azure.search

2. Install the client library.
3. Accept the additional package installations so that all dependencies are also installed.
4. Install the Json.NET package from Newtonsoft. This library is used in AzureSearchHelper class. We recommend the stable version. You can change filters to return the stable version.
5. Add an assembly reference for System.Configuration. Right-click **DataIndexer** | **Add** | **Reference** | **Framework** | **System.Configuration**.  Select the check box. Click **OK**.

A partial list of the assemblies used in this example is shown below.

![][5]

##Create AzureSearchHelper.cs

Code that calls the REST API should include a class that handles connections and the serialization and deserialization of JSON requests and responses.

In samples provided with Azure Search, this class is typically called **AzureSearchHelper.cs**.  You can create this class and add it to **DataIndexer**, using the following code.

1. In Solution Explorer, right-click **DataIndexer** | **Add** | **New Item** | **Code** | **Class**.
2. Name the class **AzureSearchHelper**.
3. Replace the default code with the following example.

		//Copyright 2015 Microsoft
		
		//Licensed under the Apache License, Version 2.0 (the "License");
		//you may not use this file except in compliance with the License.
		//You may obtain a copy of the License at
		
		//       http://www.apache.org/licenses/LICENSE-2.0
		
		//Unless required by applicable law or agreed to in writing, software
		//distributed under the License is distributed on an "AS IS" BASIS,
		//WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
		//See the License for the specific language governing permissions and
		//limitations under the License.
		
		using System;
		using System.Net.Http;
		using System.Text;
		using Newtonsoft.Json;
		using Newtonsoft.Json.Converters;
		using Newtonsoft.Json.Serialization;
		
		namespace DataIndexer
		{
		    public class AzureSearchHelper
		    {
		        public const string ApiVersionString = "api-version=2015-02-28";
		
		        private static readonly JsonSerializerSettings _jsonSettings;
		
		        static AzureSearchHelper()
		        {
		            _jsonSettings = new JsonSerializerSettings
		            {
		                Formatting = Formatting.Indented, // for readability, change to None for compactness
		                ContractResolver = new CamelCasePropertyNamesContractResolver(),
		                DateTimeZoneHandling = DateTimeZoneHandling.Utc
		            };
		
		            _jsonSettings.Converters.Add(new StringEnumConverter());
		        }
		
		        public static string SerializeJson(object value)
		        {
		            return JsonConvert.SerializeObject(value, _jsonSettings);
		        }
		
		        public static T DeserializeJson<T>(string json)
		        {
		            return JsonConvert.DeserializeObject<T>(json, _jsonSettings);
		        }
		
		        public static HttpResponseMessage SendSearchRequest(HttpClient client, HttpMethod method, Uri uri, string json = null)
		        {
		            UriBuilder builder = new UriBuilder(uri);
		            string separator = string.IsNullOrWhiteSpace(builder.Query) ? string.Empty : "&";
		            builder.Query = builder.Query.TrimStart('?') + separator + ApiVersionString;
		
		            var request = new HttpRequestMessage(method, builder.Uri);
		
		            if (json != null)
		            {
		                request.Content = new StringContent(json, Encoding.UTF8, "application/json");
		            }
		
		            return client.SendAsync(request).Result;
		        }
		
		        public static void EnsureSuccessfulSearchResponse(HttpResponseMessage response)
		        {
		            if (!response.IsSuccessStatusCode)
		            {
		                string error = response.Content == null ? null : response.Content.ReadAsStringAsync().Result;
		                throw new Exception("Search request failed: " + error);
		            }
		        }
		    }
		}


##Create the indexer

1. In Solution Explorer, open **DataIndexer** | **Program.cs**
2. Replace the contents of Program.cs with the following code.

				using Microsoft.Azure;
				using Microsoft.Azure.Search;
				using Microsoft.Azure.Search.Models;
				using Microsoft.Spatial;
				using System;
				using System.Collections.Generic;
				using System.Configuration;
				using System.IO;
				using System.Linq;
				using System.Net;
				using System.Net.Http;
				using System.Text;
				using System.Threading;
				using System.Threading.Tasks;
				using System.Timers;
				
				namespace DataIndexer
				{
				    class Program
				    {
				        private static SearchServiceClient _searchClient;
				        private static SearchIndexClient _indexClient;
				
				        // This Sample shows how to delete, create, upload documents and query an index
				        static void Main(string[] args)
				        {
				            string searchServiceName = ConfigurationManager.AppSettings["SearchServiceName"];
				            string apiKey = ConfigurationManager.AppSettings["SearchServiceApiKey"];
				
				            // Create an HTTP reference to the catalog index
				            _searchClient = new SearchServiceClient(searchServiceName, new SearchCredentials(apiKey));
				            _indexClient = _searchClient.Indexes.GetClient("geonames");
				
				            Console.WriteLine("{0}", "Deleting index...\n");
				            if (DeleteIndex())
				            {
				                Console.WriteLine("{0}", "Creating index...\n");
				                CreateIndex();
				                Console.WriteLine("{0}", "Sync documents from Azure SQL...\n");
				                SyncDataFromAzureSQL();
				            }
				            Console.WriteLine("{0}", "Complete.  Press any key to end application...\n");
				            Console.ReadKey();
				        }
				
				        private static bool DeleteIndex()
				        {
				            // Delete the index if it exists
				            try
				            {
				                AzureOperationResponse response = _searchClient.Indexes.Delete("geonames");
				            }
				            catch (Exception ex)
				            {
				                Console.WriteLine("Error deleting index: {0}\r\n", ex.Message.ToString());
				                Console.WriteLine("Did you remember to add your SearchServiceName and SearchServiceApiKey to the app.config?\r\n");
				                return false;
				            }
				
				            return true;
				        }
				
				        private static void CreateIndex()
				        {
				            // Create the Azure Search index based on the included schema
				            try
				            {
				                var definition = new Index()
				                {
				                    Name = "geonames",
				                    Fields = new[] 
				                    { 
				                        new Field("FEATURE_ID",     DataType.String)         { IsKey = true,  IsSearchable = false, IsFilterable = false, IsSortable = false, IsFacetable = false, IsRetrievable = true},
				                        new Field("FEATURE_NAME",   DataType.String)         { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = false, IsRetrievable = true},
				                        new Field("FEATURE_CLASS",  DataType.String)         { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = false, IsRetrievable = true},
				                        new Field("STATE_ALPHA",    DataType.String)         { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = false, IsRetrievable = true},
				                        new Field("STATE_NUMERIC",  DataType.Int32)          { IsKey = false, IsSearchable = false, IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
				                        new Field("COUNTY_NAME",    DataType.String)         { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = false, IsRetrievable = true},
				                        new Field("COUNTY_NUMERIC", DataType.Int32)          { IsKey = false, IsSearchable = false, IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
				                        new Field("LOCATION",       DataType.GeographyPoint) { IsKey = false, IsSearchable = false, IsFilterable = true,  IsSortable = true,  IsFacetable = false, IsRetrievable = true},
				                        new Field("ELEV_IN_M",      DataType.Int32)          { IsKey = false, IsSearchable = false, IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
				                        new Field("ELEV_IN_FT",     DataType.Int32)          { IsKey = false, IsSearchable = false, IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
				                        new Field("MAP_NAME",       DataType.String)         { IsKey = false, IsSearchable = true,  IsFilterable = true,  IsSortable = true,  IsFacetable = false, IsRetrievable = true},
				                        new Field("DESCRIPTION",    DataType.String)         { IsKey = false, IsSearchable = true,  IsFilterable = false, IsSortable = false, IsFacetable = false, IsRetrievable = true},
				                        new Field("HISTORY",        DataType.String)         { IsKey = false, IsSearchable = true,  IsFilterable = false, IsSortable = false, IsFacetable = false, IsRetrievable = true},
				                        new Field("DATE_CREATED",   DataType.DateTimeOffset) { IsKey = false, IsSearchable = false, IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true},
				                        new Field("DATE_EDITED",    DataType.DateTimeOffset) { IsKey = false, IsSearchable = false, IsFilterable = true,  IsSortable = true,  IsFacetable = true,  IsRetrievable = true}
				                    }
				                };
				
				                _searchClient.Indexes.Create(definition);
				            }
				            catch (Exception ex)
				            {
				                Console.WriteLine("Error creating index: {0}\r\n", ex.Message.ToString());
				            }
				
				        }
				
				        private static void SyncDataFromAzureSQL()
				        {
				            // This will use the Azure Search Indexer to synchronize data from Azure SQL to Azure Search
				            Uri _serviceUri = new Uri("https://" + ConfigurationManager.AppSettings["SearchServiceName"] + ".search.windows.net");
				            HttpClient _httpClient = new HttpClient();
				            _httpClient.DefaultRequestHeaders.Add("api-key", ConfigurationManager.AppSettings["SearchServiceApiKey"]);
				
				            Console.WriteLine("{0}", "Creating Data Source...\n");
				            Uri uri = new Uri(_serviceUri, "datasources/usgs-datasource");
				            string json = "{ 'name' : 'usgs-datasource','description' : 'USGS Dataset','type' : 'azuresql','credentials' : { 'connectionString' : 'Server=tcp:azs-playground.database.windows.net,1433;Database=usgs;User ID=reader;Password=Search42;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;' },'container' : { 'name' : 'GeoNamesRI' }} ";
				            HttpResponseMessage response = AzureSearchHelper.SendSearchRequest(_httpClient, HttpMethod.Put, uri, json);
				            if (response.StatusCode != HttpStatusCode.Created && response.StatusCode != HttpStatusCode.NoContent)
				            {
				                Console.WriteLine("Error creating data source: {0}", response.Content.ReadAsStringAsync().Result);
				                return;
				            }
				
				            Console.WriteLine("{0}", "Creating Indexer...\n");
				            uri = new Uri(_serviceUri, "indexers/usgs-indexer");
				            json = "{ 'name' : 'usgs-indexer','description' : 'USGS data indexer','dataSourceName' : 'usgs-datasource','targetIndexName' : 'geonames','parameters' : { 'maxFailedItems' : 10, 'maxFailedItemsPerBatch' : 5, 'base64EncodeKeys': false }}";
				            response = AzureSearchHelper.SendSearchRequest(_httpClient, HttpMethod.Put, uri, json);
				            if (response.StatusCode != HttpStatusCode.Created && response.StatusCode != HttpStatusCode.NoContent)
				            {
				                Console.WriteLine("Error creating indexer: {0}", response.Content.ReadAsStringAsync().Result);
				                return;
				            }
				
				            Console.WriteLine("{0}", "Syncing data...\n");
				            uri = new Uri(_serviceUri, "indexers/usgs-indexer/run");
				            response = AzureSearchHelper.SendSearchRequest(_httpClient, HttpMethod.Post, uri);
				            if (response.StatusCode != HttpStatusCode.Accepted)
				            {
				                Console.WriteLine("Error running indexer: {0}", response.Content.ReadAsStringAsync().Result);
				                return;
				            }
				
				            bool running = true;
				            Console.WriteLine("{0}", "Synchronization running...\n");
				            while (running)
				            {
				                uri = new Uri(_serviceUri, "indexers/usgs-indexer/status");
				                response = AzureSearchHelper.SendSearchRequest(_httpClient, HttpMethod.Get, uri);
				                if (response.StatusCode != HttpStatusCode.OK)
				                {
				                    Console.WriteLine("Error polling for indexer status: {0}", response.Content.ReadAsStringAsync().Result);
				                    return;
				                }
				
				                var result = AzureSearchHelper.DeserializeJson<dynamic>(response.Content.ReadAsStringAsync().Result);
				                if (result.lastResult != null)
				                {
				                    if (result.lastResult.status.Value == "inProgress")
				                    {
				                        Console.WriteLine("{0}", "Synchronization running...\n");
				                        Thread.Sleep(1000);
				                    }
				                    else
				                    {
				                        running = false;
				                        Console.WriteLine("Synchronized {0} rows...\n", result.lastResult.itemsProcessed.Value);
				                    }
				                }
				            }
				        }
				
				        private static void SearchDocuments(string q, string filter)
				        {
				            // Execute search based on query string (q) and filter 
				            try
				            {
				                SearchParameters sp = new SearchParameters();
				                if (filter != string.Empty)
				                    sp.Filter = filter;
				                DocumentSearchResponse response = _indexClient.Documents.Search(q, sp);
				                foreach (SearchResult doc in response)
				                {
				                    string StoreName = doc.Document["StoreName"].ToString();
				                    string Address = (doc.Document["AddressLine1"].ToString() + " " + doc.Document["AddressLine2"].ToString()).Trim();
				                    string City = doc.Document["City"].ToString();
				                    string Country = doc.Document["Country"].ToString();
				                    Console.WriteLine("Store: {0}, Address: {1}, {2}, {3}", StoreName, Address, City, Country);
				                }
				            }
				            catch (Exception ex)
				            {
				                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
				            }
				        }
				
				        static string EscapeQuotes(string colVal)
				        {
				            return colVal.Replace("'", "");
				        }
				    }
				}



##Build and Run DataIndexer##

1. Right-click the **DataIndexer** project to set it as the start-up project.
2. Build and run the project.

You should see a console window with these messages.

![][6]

In the portal, you should see a new **geonames** index.  It can take the portal several minutes to catch up, so plan on refreshing the screen after a few minutes to see the results. 

![][7]

##Modify SimpleSearchMVCApp##

1. Right-click the **SimpleSearchMVCApp** project to set it as the start-up project.
2. Right-click **References** | **Add Reference** | **Extension** | **System.Web.Helpers**.

###Update HomeController.cs

Replace the default code with the following example.

		using Microsoft.Azure.Search.Models;
		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Web;
		using System.Web.Mvc;
		
		namespace SimpleSearchMVCApp.Controllers
		{
		    public class HomeController : Controller
		    {
		        //
		        // GET: /Home/
		        private FeaturesSearch _featuresSearch = new FeaturesSearch();
		
		        public ActionResult Index()
		        {
		            return View();
		        }
		
		        public ActionResult Search(string q = "")
		        {
		            // If blank search, assume they want to search everything
		            if (string.IsNullOrWhiteSpace(q))
		                q = "*";
		
		            return new JsonResult
		            {
		                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
		                Data = _featuresSearch.Search(q)
		            };
		        }
		
		
		    }
		}

###Update Index.cshtml

Replace the default code with the following example.

	@{
	    ViewBag.Title = "Azure Search - Feature Search";
	}
	
	<script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.10.2.min.js"></script>
	<script type="text/javascript">
	
	    $(function () {
	        // Execute search if user clicks enter
	        $("#q").keyup(function (event) {
	            if (event.keyCode == 13) {
	                Search();
	            }
	        });
	    });
	
	    function Search() {
	        // We will post to the MVC controller and parse the full results on the client side
	        // You may wish to do additional pre-processing on the data before sending it back to the client
	        var q = $("#q").val();
	        
	        $.post('/home/search',
	        {
	            q: q
	        },
	        function (data) {
	            var searchResultsHTML = "<tr><td>FEATURE NAME</td><td>FEATURE CLASS</td>";
	            searchResultsHTML += "<td>STATE ALPHA</td><td>COUNTY_NAME</td>";
	            searchResultsHTML += "<td>LONGITUDE</td><td>LATITUDE</td>";
	            searchResultsHTML += "<td>Elevation (m)</td><td>Elevation (ft)</td><td>MAP NAME</td>";
	            searchResultsHTML += "<td>DESCRIPTION</td><td>HISTORY</td><td>DATE CREATED</td>";
	            searchResultsHTML += "<td>DATE EDITED</td></tr>";
	            for (var i = 0; i < data.length; i++) {
	                searchResultsHTML += "<td>" + data[i].Document.FEATURE_NAME + "</td>";
	                searchResultsHTML += "<td>" + data[i].Document.FEATURE_CLASS + "</td>";
	                searchResultsHTML += "<td>" + data[i].Document.STATE_ALPHA + "</td>";
	                searchResultsHTML += "<td>" + data[i].Document.COUNTY_NAME + "</td>";
	                searchResultsHTML += "<td>" + data[i].Document.LOCATION.Latitude + "</td>";
	                searchResultsHTML += "<td>" + data[i].Document.LOCATION.Longitude + "</td>";
	                searchResultsHTML += "<td>" + data[i].Document.ELEV_IN_M + "</td>";
	                searchResultsHTML += "<td>" + data[i].Document.ELEV_IN_FT + "</td>";
	                searchResultsHTML += "<td>" + data[i].Document.MAP_NAME + "</td>";
	                searchResultsHTML += "<td>" + data[i].Document.DESCRIPTION + "</td>";
	                searchResultsHTML += "<td>" + data[i].Document.HISTORY + "</td>";
	                searchResultsHTML += "<td>" + parseJsonDate(data[i].Document.DATE_CREATED) + "</td>";
	                searchResultsHTML += "<td>" + parseJsonDate(data[i].Document.DATE_EDITED) + "</td></tr>";
	            }
	
	            $("#searchResults").html(searchResultsHTML);
	
	        });
	
	        function parseJsonDate(jsonDateString) {
	            if (jsonDateString != null)
	                return new Date(parseInt(jsonDateString.replace('/Date(', '')));
	            else
	                return "";
	        }
	    };
	
	</script>
	<h2>USGS Features Search for Washington State</h2>
	
	<div class="container">
	        <input type="search" name="q" id="q" autocomplete="off" size="100"  /> <button onclick="Search();">Search</button>
	</div>
	<br />
	<div class="container">
	    <div class="row">
	        <table id="searchResults" border="1"></table>
	    </div>
	</div>

###Update Views | Shared _Layout.cshtml

Replace the default code with the following example.

		<!DOCTYPE html>
		<html>
		<head>
		    <meta charset="utf-8" />
		    <meta name="viewport" content="width=device-width" />
		    <title>@ViewBag.Title</title>
		    @Styles.Render("~/Content/css")
		    @Scripts.Render("~/bundles/modernizr")
		</head>
		<body>
		    @RenderBody()
		
		    @Scripts.Render("~/bundles/jquery")
		    @RenderSection("scripts", required: false)
		</body>
		</html>

##Add FeaturesSearch.cs

Add a class that provides search functionality to your application.

1. In Solution Explorer, right-click **SimpleSearchMVCApp** | **Add** | **New Item** | **Code** | **Class**.
2. Name the class **FeaturesSearch**.
3. Replace the default code with the following example.

		using Microsoft.Azure.Search;
		using Microsoft.Azure.Search.Models;
		using System;
		using System.Collections.Generic;
		using System.Configuration;
		using System.Linq;
		using System.Web;
		
		namespace SimpleSearchMVCApp
		{
		    public class FeaturesSearch
		    {
		        private static SearchServiceClient _searchClient;
		        private static SearchIndexClient _indexClient;
		
		        public static string errorMessage;
		
		        static FeaturesSearch()
		        {
		            try
		            {
		                string searchServiceName = ConfigurationManager.AppSettings["SearchServiceName"];
		                string apiKey = ConfigurationManager.AppSettings["SearchServiceApiKey"];
		
		                // Create an HTTP reference to the catalog index
		                _searchClient = new SearchServiceClient(searchServiceName, new SearchCredentials(apiKey));
		                _indexClient = _searchClient.Indexes.GetClient("geonames");
		            }
		            catch (Exception e)
		            {
		                errorMessage = e.Message.ToString();
		            }
		        }
		
		        public DocumentSearchResponse Search(string searchText)
		        {
		            // Execute search based on query string
		            try
		            {
		                SearchParameters sp = new SearchParameters();
		
		                string search = "&search=" + Uri.EscapeDataString(searchText);
		                return _indexClient.Documents.Search(searchText);
		            }
		            catch (Exception ex)
		            {
		                Console.WriteLine("Error querying index: {0}\r\n", ex.Message.ToString());
		            }
		            return null;
		        }
		
		    }
		}

##Build and run SimpleSearchMVCApp

1. Remove unnecessary elements provided in the default template:
 
	- Delete **SimpleSearchMVCApp** | **Filters**.
	- Delete **SimpleSearchMVCApp** | **Images**.
	- Delete **AuthConfig.cs** in **SimpleSearchMVCApp** | **App_Start**.
	- Delete **AccountController.cs** in **SimpleSearchMVCApp** | **Controllers**.
	- Delete **AccountModels.cs** in **SimpleSearchMVCApp** | **Models**.
	- Delete **Account** in **SimpleSearchMVCApp** | **Views**.
	- Delete **About.cshtml** and **Login.cshmtl** in **SimpleSearchMVCApp** | **Views** | **Home**.
	- Delete **LoginPartial.cshtml**  in **SimpleSearchMVCApp** | **Views** | **Shared**.
2. Save all files.
3. Build and run the application.

If you get build errors, try updating NuGet packages to see if it resolves the problem.

You should see a web page in your default browser, providing a search box for accessing USGS data stored in the index in your Azure Search service.

![][8]

##Search on USGS data##

The USGS data set includes records that are relevant to Washington state. If you click **Search** on an empty search box, you will get the top 50 entries, which is the default. 

Entering a search term will give the search engine something to go on. Try entering a regional name. "Snoqualmie" is city in Washington. It is also the name of a river, a scenic waterfall, mountain pass, and state parks.

![][9]

You could also try any of these terms:

- Seattle
- Rainier
- Seattle and Rainier
- Seattle +Rainier -Mount (gets results for landmarks on Rainier avenue, or the Rainier club, all within the city limits of Seattle).

##Explore the code##

To learn the basics of the .NET SDK, take a look at [How to use Azure Search in .NET](search-howto-dotnet-sdk.md) for an explanation of the most commonly used classes in the client library.

The remainder of this section covers a few points about each project. Where appropriate, we'll point you towards some alternative approaches that use more advanced features.

**DataIndexer Project**

To keep things simple, the data is embedded within the solution, in a text file generated from data on the [United States Geological Services (USGS) web site](http://geonames.usgs.gov/domestic/download_data.htm). 

Alternatives to embedding data include [indexers for DocumentDB](documentdb-search-indexer.md) or [indexers for Azure SQL Database](search-howto-connecting-azure-sql-database-to-azure-search-using-indexers-2015-02-28.md). Indexers pull data into your Azure Search index, which can really simplify the code you have to write and maintain. 

You can also load data from an on premises SQL Server database. [This tutorial](http://azure.microsoft.com/blog/2014/11/10/how-to-sync-sql-server-data-with-azure-search/) shows you how.

The **DataIndexer** program includes a **SearchDocuments** method for searching and filtering data. This method exists as a verification step, supporting the status messages output to the console window, namely those showing search results and filter behaviors. Most likely, you wouldn't need a method like this in code that you write for creating and loading an index. 

**SimpleSearchMVCApp Project**

The MVC project uses a view and controller to route inputs and outputs to the presentation layer. **Index.cshtml** provides the HTML used for rendering the search results. Currently, this is just a simple table that organizes the data from the dataset. While useful for prototyping and testing, you can easily improve upon the presentation. For tips on how to batch results and put counts on a page, see [Page results and pagination in Azure Search](search-pagination-page-layout.md).

Connections to Azure Search, plus execution of a query request, are defined in the **FeatureSearch.cs** file.

As a final note, if you are not yet convinced of the value and simplicity of the .NET SDK, compare the source files of this sample against this one based on the REST API: [Azure Search Adventure Works Demo](https://azuresearchadventureworksdemo.codeplex.com/). The .NET SDK version described in this tutorial is much simpler, with fewer lines of code.

##Next steps##

This is the first Azure Search tutorial based on the USGS dataset. Over time, we'll be extending this tutorial and creating new ones that demonstrate the search features you might want to use in your custom solutions.

If you already have some background in Azure Search, you can use this sample as a springboard for trying suggesters (type-ahead or autocomplete queries), filters, and faceted navigation. You can also improve upon the search results page by adding counts and batching documents so that users can page through the results.

New to Azure Search? We recommend trying other tutorials to develop an understanding of what you can create. Visit our [documentation page](http://azure.microsoft.com/documentation/services/search/) to find more resources. You can also view the links in our [Video and Tutorial list](https://msdn.microsoft.com/library/azure/dn798933.aspx) to access more information.

<!--Image references-->
[1]: ./media/search-get-started-dotnet/create-search-portal-1.PNG
[2]: ./media/search-get-started-dotnet/create-search-portal-2.PNG
[3]: ./media/search-get-started-dotnet/create-search-portal-3.PNG

[4]: ./media/search-get-started-dotnet/AzSearch-DotNet-VSSolutionExplorer.png
[5]: ./media/search-get-started-dotnet/AzSearch-DotNet-Assembly.png

[6]: ./media/search-get-started-dotnet/consolemessages.png
[7]: ./media/search-get-started-dotnet/portalindexstatus.png
[8]: ./media/search-get-started-dotnet/usgssearchbox.png
[9]: ./media/search-get-started-dotnet/snoqualmie.png