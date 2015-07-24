<properties 
	pageTitle="Azure Search Developer Case Study: How WhatToPedia built an infomedia portal on Microsoft Azure" 
	description="Learn how to build an information portal and meta search engine using Search service on Microsoft Azure" 
	services="search, sql-database,  storage, web-sites" 
	documentationCenter="" 
	authors="HeidiSteen" 
	manager="mblythe"/>

<tags 
	ms.service="search" 
	ms.devlang="NA" 
	ms.topic="article" 
	ms.tgt_pltfrm="na" 
	ms.workload="search" 
	ms.date="07/08/2015" 
	ms.author="heidist"/>

# Azure Search Developer Case Study

## How [WhatToPedia.com](http://whattopedia.com/) built an infomedia portal on Microsoft Azure

 ![][6]  &nbsp;&nbsp;&nbsp;  <font size="9">The big idea</font> 


Our idea is to build an information portal that helps shoppers connect with retailers through a highly-relevant, scoped-search experience, similar to how travel portals match tourists up with the hotels, restaurants, and entertainment when in uncharted territory. 

The portal we envision will deliver an exceptionally high-quality search experience over retailer data in a given market, helping shoppers find stores based on location and other amenities the retailer provides. We will seed the search engine with an initial dataset, but deeper value will be built over time, with the help of retailer subscribers who post information about their business. Promotions, new merchandise, popular brands, in-house specialty services -– all are examples of data that adds value to our site. This data is self-reported and integrated into the search corpus, once the retailer signs up as a subscriber. Advertising, plus the subscription model, provide the revenue stream for our new business.

Search will be the predominant user interaction model, on a pure cloud platform. For purposes of scale and low-costs, almost everything we do, from the portal experience to source control, will be through an online service. Using a search engine that provides the features we need out of the box, we can create a search application quickly, without having to build and manage a search engine ourselves.

## What we built

WhatToPedia is a start-up infomedia company. We built [WhatToPedia.com](http://whattopedia.com/) –- currently in test-market in northern Europe with a go-live date of February 2, 2015. Our customer base is primarily brick-and-mortar shops who need an affordable online presence that is easy to manage and maintain.

Our task is to attract shoppers through a great online search experience, boosting results based on city or neighborhood, brands, store names, or store types. Attracting shoppers has a ripple effect, motivating retailers to subscribe to our portal site. Subscriptions are fee-based, at an affordable rate.

 ![][7] 

After signing up for a subscription, a retailer takes over their existing profile (created initially by us from purchased data), updating it with additional data about promotions, featured brands, or announcements. In-house capabilities, such as languages spoken, currencies accepted, tax-free shopping, can be self-reported to better attract shoppers who are looking for those amenities.

## Who we are

My name is Thomas Segato (Microsoft Consulting) and I worked with Jesper Boelling, Lead Developer at WhatToPedia, to design the solution. 

WhatToPedia is a start-up, test marketing its new portal business in Sweden, where most of the 60,000 retailers are brick-and-mortar SMEs (small and medium sized enterprises). Because we know that a person shopping in Europe speaks multiple languages and carries multiple currencies, we build solutions that accommodate a multilingual shopper. We needed, and found, a search engine that supports our multilingual requirements in Azure Search.

Azure Search was a game-changer for our project. Prior to the availability of Azure Search, we expended considerable energy working through the kinks of building our own search engine. Having Azure Search as an online service removed the biggest technical and administrative hurdle from our solution, which meant getting to market faster, and with a more robust search experience.  

## How we did it

Our vision was to build a complete infrastructure based on cloud services only. Microsoft was chosen as the strategic platform because it was the provider that offered the necessary services (for both collaboration and development), scale on demand, and affordable pricing.
 
### High-level components

We built a business, not just a site. Supporting the entire effort required a full range of tools and applications. We adopted Visual Studio and Visual Studio Online for development, Team Foundation Service (TFS) Online for source control and scrum management, Office 365 for communication and collaboration, and of course Microsoft Azure for all site-related operations and storage. With Visual Studio, the IDE provided direct provisioning to Azure, with integration to TFS Online providing an additional productivity boost.

The diagram below illustrates the high-level components used in the WhatToPedia infrastructure.

   ![][8]

### How we use Microsoft Azure

Looking at the green boxes in the previous diagram, you’ll see that the WhatToPedia solution is built on these services:

- [Azure Search](http://azure.microsoft.com/services/search/)
- [Azure Websites using MVC 4](http://azure.microsoft.com/services/websites/)
- [Azure WebJobs for scheduled tasks](../websites-webjobs-resources.md)
- [Azure SQL Database](http://azure.microsoft.com/services/sql-database/)
- [Azure BLOB Storage](http://azure.microsoft.com/services/storage/)
- [SendGrid Email Delivery](http://azure.microsoft.com/marketplace/partners/sendgrid/sendgrid-azure/)

The very heart of the solution is data and search. The flow of data from the Reseller provider to the end customer is illustrated below:

  ![][9]

Primary data storage is the reseller and accounting data in Azure SQL Database. This consists of the initial dataset, plus retailer-specific data added over time. We’re using an Azure WebJob to post updates from SQL Database to the search corpus in Azure Search.

### Presentation layer

The portal is an Azure Website, implemented in MVC 4 and [Twitter Bootstrap](http://en.wikipedia.org/wiki/Bootstrap_%28front-end_framework%29). We chose MVC because it offers a much cleaner approach to HTML than ASP.NET forms-based development. To avoid having to create apps for multiple devices and maintain multiple mobile platforms, Twitter Bootstrap was chosen to support all devices and platforms.

### Authentication, permissions and sensitive data

Shoppers browse the site anonymously. As such, there are no login requirements for shoppers, nor do we store any consumer data. 

Retailers are a different story. Here, we store public-facing profile information, billing information, and media content that they want to expose on the site. Every retailer who subscribes to the site get a user login, used to authenticate the user prior to making updates to the subscriber’s profile.  We securely store all subscriber data in Azure SQL Database and Azure BLOB storage.
We opted for an authentication model based on .NET forms-based authentication. We chose this approach for its simplicity; we didn’t need the roles, UI support and other extraneous features that come with other approaches. 

To ensure that retailers only see the data that belongs to them, we created a retailer ID for each retailer that is subsequently used on all read and write operations involving retailer-specific data. With this approach, we found that we did not need to grant database permissions to individual retailers. All retailers interact with the system under a single database role, with the retailer ID as our data isolation technique.

Because our business is all about the downstream effects (driving more business to retailers, creating incentive to advertise and subscribe), we can draw the line at handling purchases over the web. As such, you won’t find a shopping cart on our site, which simplifies our security requirements. 

Another simplification we employed was to outsource our billing and accounts payable operations. By routing customer payment information directly to a third-party ([SveaWebPay](http://www.sveawebpay.se/)), we reduce the risks associating with storing and protecting sensitive data in our data stores. 

### Search Engine

The core of our solution is the search engine built on Azure Search service. Initially, we built a custom search engine, but during this process, we realized the complexity and effort was very high indeed, and that prompted us to consider other alternatives. 

Basic features that were most important to us included:

- Filters
- Faceted navigation
- Boosting results
- Paging through AJAX

An internet search brought us to the following video, which inspired us to give Azure Search a try: [Deep Dive at TechEd Europe](http://channel9.msdn.com/events/TechEd/Europe/2014/DBI-B410) 

After watching the video, we were ready to build a prototype based on what we saw. Because we already had a data model in MVC, creating the prototype was straightforward because the data contained searchable terms, and we had already worked out the requirements for how we wanted to sort, facet, and filter the data. 

This is how we built the prototype.

**Configure Azure Search Service**

1. Login to Azure portal and added the Search service to our subscription. We used the shared version (free with our subscription).
2. Create an index. For the prototype, we used the portal UI to define the search fields and create the scoring profiles. Our scoring profile is based on location data: country | city |address (see: Add scoring profiles).
3. Copy the service URL and admin api-key to our configuration files. This key is on the Search service page in the portal, and it’s used to authenticate to the service.
	
**Develop a Search Indexer Job – Windows Console**

1. Read all resellers from database.
2. Call the Azure Search Service API to upload resellers one by one (see: http://msdn.microsoft.com/library/azure/dn798930.aspx).
3. Set a property in database that reseller is indexed for incremental indexing. We did this by adding an ‘indexer’ field that stores the index status of each profile (indexed or not). 

See the appendix for the code snippet that builds the indexer job.

**Develop a Search Web Portal – MVC**

1. Call Azure Search Service to get all documents from search (see: http://msdn.microsoft.com/library/azure/dn798927.aspx)
2. Extract following from the search service response (by using json.net http://james.newtonking.com/json)
   - Results
   - Facets
   - Result counts
   - Develop a user interface for displaying search results, facets and counts (we already had this).

This is the code we used to get the results from Azure Search:

    string requestUrl = 
    string.Format("https://{0}.search.windows.net/indexes/profiles/docs?searchMode=all&$count=true&search={1}&facet=city,count:20&facet=category&$top=10&$skip={2}&api-version=2014-07-31-Preview{3}", Config.SearchServiceName, EscapeODataString(q), skip, filter);
      var response = client.GetAsync(requestUrl).Result; //  + Uri.EscapeDataString("hennes")
      response.EnsureSuccessStatusCode();
     dynamic json = JsonConvert.DeserializeObject(response.Content.ReadAsStringAsync().Result);

**Boosting by location**

Probably the most important requirement to verify in the prototype included adding a location search keyword to the query. It is vital to our portal that if a user enters a city name in the search query, that the resellers in the given city would rank higher than resellers having the city keyword in the description. For this requirement, we used a scoring profile to rank the city field higher than other fields.

**Supporting multiple languages**

We needed to display correct search results in correct languages, and provide an option for finding the same results in different languages. The two sides to this problem were: 

- Search for words in multiple languages
- Display search results in correct language

We solved the presentation part by adding a document for each language with localized text and a property with the language. When a user enters a search term, we user `$filter` expressions to filter on the language the user has chosen.

Each of the documents has a hidden property called "cities" built on the collection type. This property stores city names in all languages, enabling the user to search in multiple languages.

###Data storage

All data (profile, subscription, and accounting) is stored in SQL Database. All media files are stored in Azure BLOB storage, including images and videos provided by the retailer. Using separate BLOB storage isolates the effects of uploading files; files are never co-mingled with the website, so we don’t need to rebuild the site whenever we add files.

An important benefit of our storage design is that multiple developers can share a single development storage. One of the requirements for the WhatToPedia project was to be able to create a development environment within 15 minutes, including reseller data, images, and videos. By getting the latest data from TFS Online, running a SQL script, and running the import job, a complete environment can be stood up in no time at all. This practice also improves the staging process.

###WebJobs

We use Azure WebJobs to update data to the index. By creating a search indexer job, the indexing part was very easy to integrate into our solution. The only code change we made was to accommodate the indexer job was to add an `Indexed` field to our data model to indicate the index state. Whenever a new profile is added or updated, the `Indexed` field is set to false. The same applies if the retailer changes his or her profile data through the portal.  

The job looks for all rows having `Indexed` set to false. When it finds the row, the document is posted to Azure Search, and then the `Indexed` field is set to true. We didn’t have to plan for adding versus updating data because the Azure Search service actually takes care of this. If you add a document that is already present, the service will do an update automatically.

All web jobs have been developed as console applications that can be uploaded to Azure web sites as ZIP files, unzipped, and then scheduled.

The job is scheduled to run every 5 minutes as a scheduled web task. We calculated that the service takes approximately three minutes to upload 3,000 documents, which was within our requirements. 

> [AZURE.NOTE] There is a prototype indexer feature that was recently introduced in Azure Search. This feature came too late for us to use it in our first release, but it appears to solve the same problem we used our indexer job for, which is to automate data load operations.


###Backup strategy

We designed a multi-tiered backup strategy to recover from a range of scenarios, from catastrophic failure, down to recovery of an individual transaction. The assets to protect include three kinds of data (web site, subscriber data, and media files). 

First, by keeping the web site source code in TFS Online, we know that if the site goes down, we can rebuild it by republishing from TFS. 

Subscriber data in Azure SQL Database is the most sensitive asset. We back this up using the built-in feature (see [Azure SQL Database Backup and Restore](http://msdn.microsoft.com/library/azure/jj650016.aspx)). The backup schedule is full database backup once a week, differential database backups once a day, and transaction log backups every 5 minutes.  Given the size of the data, this solution is more than adequate for our immediate and projected data volumes.

Third, we store image and video files in Azure BLOB storage. We are still evaluating the ultimate backup plan for this data, considering Cloudberry Explorer for Azure as a potential solution. For now, we use a WebJob to copy images and videos to another location.

##What we learned

Because we already had data, it was easy to establish proof-of-concept. Within hours, we had a prototype with facets and counters, paging, ranked profiles, and search results. The search results were so precise, we decided to remove some of the filters presented to the end customer. 

The biggest surprise for us was how fast we could learn Azure Search, and how much we got back. Literally, we established proof-of-concept in a few hours (see the note below), replacing 500 lines of code with 3 lines of code in the front end application (plus a new WebJob), and getting better results. 

Previously, our code implemented paging, counts, and other behaviors that are standard to search. Using Azure Search, the results we get back include the search hits, facets, paging data, counts -- all the stuff we needed and were having to supply ourselves. It also included boosting and built-in faceted navigation, which we didn’t have in our original solution.

The greatest challenge during implementation was that it was a Preview version and finding information and shared experiences was difficult. Once we connected a few dots, we found that using Azure Search Service was pretty simple due to its REST API and JSON data format. We could call the framework directly from most open source plugins like JQuery JSON.Net, and we could use tools like Fiddler for fast experimentation and debugging. 

> [AZURE.NOTE] Besides having the data prepped, it helped that those of us building the prototype already understood how search technology works, making us more productive, and more appreciative of the built-in features. If you need to ramp up on search query construction, faceted navigation, filters, etc. you should expect prototyping to take longer. 

###Controlling facets in the search presentation page

One of our learnings during the proof-of-concept was to plan facets carefully upfront. After loading a lot of data into the solution, we saw that the sheer volume of facets was too high to present to the users. 

We solved this by constraining the facet count parameter. The count parameter imposes a hard limit on the number of facets returned to the user. A link that includes a discussion of the count parameter can be found [here](search-faceted-navigation.md).

###WebJobs for scheduling tasks

Azure Search wasn’t the only pleasant surprise for us. We discovered that using WebJobs to automate our data load operations to Azure Search was vastly superior to our previous approach, which entailed using a dedicated VM running Windows Scheduler, with scheduled tasks for updating the search index. WebJobs was simpler to configure and easier to debug, and of course much cheaper than having to pay for a dedicated VM.

###Azure BLOB Storage Explorer for updating images

We found that using [Azure BLOB Storage Explorer](https://azurestorageexplorer.codeplex.com/) (available on codeplex) to be very helpful in managing image and video updates to the site. We use it as a developer tool to manually update images and videos that are part of our main site. We found it to be more flexible than deploying changes to the portal, and eliminates a complete test iteration whenever we need to update an image. 

##A few final words

Thanks to the great folks at WhatToPedia for allowing us to share their story!  

We hope you found this case study useful. If you go on to use Azure Search, I recommend a few resources to speed you along:

- [MSDN forum dedicated to Azure Search](https://social.msdn.microsoft.com/forums/azure/home?forum=azuresearch)
- [StackOverflow also has a tag](http://stackoverflow.com/questions/tagged/azure-search)
- [Documentation page on Azure.com](http://azure.microsoft.com/documentation/services/search/)
- [Azure Search documentation on MSDN](http://msdn.microsoft.com/library/azure/dn798933.aspx)


##Appendix: Search Indexer WebJob

The following code builds the indexer mentioned in the section on building the prototype.

        static void Main(string[] args)
        {
            int success = 0;
            int errors = 0;

            Log.Write("Starting job","", System.Diagnostics.TraceLevel.Info);

            var serviceName = ConfigurationManager.AppSettings["SearchServiceName"];
            var serviceKey = ConfigurationManager.AppSettings["SearchServiceKey"];

            HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("api-key", serviceKey);

            var db = new DB(Config.ConectionString);

            var recreateIndex = false;
            Boolean.TryParse(ConfigurationManager.AppSettings["RecreateIndex"], out recreateIndex);

            if(recreateIndex)
            {
                Log.Write("Recreating index and set all to no index", "", System.Diagnostics.TraceLevel.Info);
                db.SetAllToNotIndexed();
                RecreateIndex(serviceName, client);
            }            
            
            var profiles = db.Profiles.Where(p=>!p.Indexed).ToList();

            Log.Write(string.Format("Indexing {0} profiles",profiles.Count),"", System.Diagnostics.TraceLevel.Info);

            var cities = db.Cities.ToList();
            var categories = db.Tags.Where(p=>p.ParentId==null).ToList();            

            foreach (var profile in profiles)
            {
                Log.Write(string.Format("Indexing profile {0}", profile.Name),"",profile.ProfileId,0,System.Diagnostics.TraceLevel.Verbose);

                try
                {
                    var city = cities.Where(p => p.CityId == profile.CityId);
                    var category = categories.Where(p => p.TagId == profile.CategoryId);

                    var cityse = city.Where(p => p.Lang == "se").FirstOrDefault();
                    var cityen = city.Where(p => p.Lang == "en").FirstOrDefault();
                    var categoryse = category.Where(p => p.Lang == "se").FirstOrDefault();
                    var categoryen = category.Where(p => p.Lang == "en").FirstOrDefault();

                    var citysename = cityse == null ? "" : cityse.Name;
                    var cityenname = cityen == null ? "" : cityen.Name;
                    var categorysename = categoryse == null ? "" : categoryse.Name;
                    var categoryenname = categoryen == null ? "" : categoryen.Name;

                    var tags = db.GetTagsFromProfile(profile.ProfileId);

                    var batch = new
                    {
                        value = new[] 
                    { 
                        new 
                        { 
                            id = profile.ProfileId.ToString()+"_en",
                            profileid = profile.ProfileId.ToString(),
                            city = cityenname,
                            category = categoryenname,
                            address = profile.Adress1,
                            email = profile.Email,
                            name = profile.Name,
                            lang = "en",
                            brands = profile.Brands,
                            descen=profile.DescEn,
                            descse=profile.DescSe,
                            orgnumber=profile.OrgNumber,
                            phone=profile.Phone,
                            zip=profile.Zip,
                            cities = city.Select(p=>p.Name).ToArray(),
                            categories = category.Select(p=>p.Name).ToArray(),
                            cityid = profile.CityId.ToString(),
                            tags=tags.ToArray()
                        },
                        new 
                        { 
                            id = profile.ProfileId.ToString()+"_se",
                            profileid = profile.ProfileId.ToString(),
                            city = citysename,
                            category = categorysename,
                            address = profile.Adress1,
                            email = profile.Email,
                            name = profile.Name,
                            lang = "se",
                            brands = profile.Brands,
                            descen=profile.DescEn,
                            descse=profile.DescSe,
                            orgnumber=profile.OrgNumber,
                            phone=profile.Phone,
                            zip=profile.Zip,
                            cities = city.Select(p=>p.Name).ToArray(),
                            categories = category.Select(p=>p.Name).ToArray(),
                            cityid = profile.CityId.ToString(),
                            tags=tags.ToArray()
                        }
                    },
                    };

                    var response = client.PostAsync("https://" + serviceName + ".search.windows.net/indexes/profiles/docs/index?api-version=2014-10-20-Preview", new StringContent(JsonConvert.SerializeObject(batch), Encoding.UTF8, "application/json")).Result;
                    response.EnsureSuccessStatusCode();

                    db.Entry(profile).State = System.Data.Entity.EntityState.Modified;
                    profile.Indexed = true;
                    db.SaveChanges();
                    success++;
                }
                catch(Exception ex)
                {
                    Log.Write("Error indexing profile", ex.Message, profile.ProfileId, 0, System.Diagnostics.TraceLevel.Verbose);
                    errors++;
                }
            }
            if(errors > 0)
            {
                Log.Write(string.Format("Job ended success ({0}), errors ({1})", success, errors), "", System.Diagnostics.TraceLevel.Error);
            }
            else
            {
                Log.Write(string.Format("Job ended success ({0}), errors ({1})", success, errors), "", System.Diagnostics.TraceLevel.Info);
            }
            
        }

        static void RecreateIndex( string ServiceName, HttpClient client)
        {
            var index = new
            {
                name = "profiles",
                fields = new[] 
                { 
                    new { name = "id",              type = "Edm.String",         key = true,  searchable = false, filterable = false, sortable = false, facetable = false, retrievable = true,  suggestions = false },
                    new { name = "profileid",       type = "Edm.String",         key = false,  searchable = false, filterable = false, sortable = false, facetable = false, retrievable = true,  suggestions = false },
                    new { name = "cityid",          type = "Edm.String",         key = false,  searchable = false, filterable = false, sortable = false, facetable = false, retrievable = true,  suggestions = false },
                    new { name = "city",            type = "Edm.String",         key = false, searchable = true,  filterable = true, sortable = true,  facetable = true, retrievable = true,  suggestions = true  },
                    new { name = "category",        type = "Edm.String",         key = false, searchable = true,  filterable = true, sortable = false, facetable = true, retrievable = true,  suggestions = false  },
                    new { name = "address",         type = "Edm.String",         key = false, searchable = true,  filterable = true,  sortable = true,  facetable = false,  retrievable = true,  suggestions = false },
                    new { name = "email",           type = "Edm.String",         key = false, searchable = true,  filterable = false, sortable = true, facetable = false, retrievable = true,  suggestions = false },
                    new { name = "name",            type = "Edm.String",         key = false, searchable = true,  filterable = true,  sortable = true,  facetable = false,  retrievable = true, suggestions = true },
                    new { name = "lang",            type = "Edm.String",         key = false, searchable = true,  filterable = true,  sortable = false,  facetable = false,  retrievable = true, suggestions = false },
                    new { name = "brands",          type = "Edm.String",         key = false, searchable = true,  filterable = true,  sortable = true,  facetable = false,  retrievable = true,  suggestions = false },
                    new { name = "descen",          type = "Edm.String",         key = false, searchable = true,  filterable = true,  sortable = true,  facetable = false,  retrievable = true,  suggestions = false },
                    new { name = "descse",          type = "Edm.String",         key = false, searchable = true,  filterable = true,  sortable = true,  facetable = false,  retrievable = true,  suggestions = false },
                    new { name = "orgnumber",       type = "Edm.String",         key = false, searchable = true,  filterable = true,  sortable = true,  facetable = false,  retrievable = true,  suggestions = false },
                    new { name = "phone",           type = "Edm.String",         key = false, searchable = true,  filterable = true,  sortable = true,  facetable = false,  retrievable = true,  suggestions = false },
                    new { name = "zip",             type = "Edm.String",         key = false, searchable = true,  filterable = true,  sortable = true,  facetable = false,  retrievable = true,  suggestions = false },
                    new { name = "cities",          type = "Collection(Edm.String)",         key = false, searchable = true,  filterable = false,  sortable = false,  facetable = false,  retrievable = false, suggestions = false },
                   new { name = "categories",      type = "Collection(Edm.String)",         key = false, searchable = true,  filterable = false,  sortable = false,  facetable = false,  retrievable = false, suggestions = false },
                    new { name = "tags",            type = "Collection(Edm.String)",         key = false, searchable = true,  filterable = false,  sortable = false,  facetable = false,  retrievable = false, suggestions = false }
                    
                }
            };

            var url = "https://" + ServiceName + ".search.windows.net/indexes/?api-version=2014-10-20-Preview";

            var deleteUrl = "https://" + ServiceName + ".search.windows.net/indexes/profiles?api-version=2014-10-20-Preview";

            try
            {
                var deleteResponseIndex = client.DeleteAsync(deleteUrl).Result;
                deleteResponseIndex.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {

            }

            var responseIndex = client.PostAsync(url, new StringContent(JsonConvert.SerializeObject(index), Encoding.UTF8, "application/json")).Result;
            responseIndex.EnsureSuccessStatusCode();            
          


<!--Anchors-->
[Subheading 1]: #subheading-1
[Subheading 2]: #subheading-2
[Subheading 3]: #subheading-3
[Subheading 4]: #subheading-4
[Subheading 5]: #subheading-5
[Next steps]: #next-steps

<!--Image references-->
[6]: ./media/search-dev-case-study-whattopedia/lightbulb.png
[7]: ./media/search-dev-case-study-whattopedia/WhatToPedia-Search-Bageri.png
[8]: ./media/search-dev-case-study-whattopedia/WhatToPedia-Stack.png
[9]: ./media/search-dev-case-study-whattopedia/WhatToPedia-Archicture.png


<!--Link references-->
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial.md
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name.md
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account.md
 