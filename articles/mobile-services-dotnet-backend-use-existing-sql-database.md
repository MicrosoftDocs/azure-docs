<properties 
	pageTitle="Build a service using an existing SQL database with the Mobile Services .NET backend - Azure Mobile Services" 
	description="Learn how to use an existing cloud or on-premises SQL database with your .NET based mobile service" 
	services="mobile-services" 
	documentationCenter="" 
	authors="ggailey777" 
	manager="dwrede" 
	editor="mollybos"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="multiple" 
	ms.topic="article" 
	ms.date="04/13/2015" 
	ms.author="glenga"/>


# Build a service using an existing SQL database with the Mobile Services .NET backend

The Mobile Services .NET backend makes it easy to take advantage of existing assets in building a mobile service. One particularly interesting scenario is using an existing SQL database (either on-premises or in the cloud), that may already be used by other applications, to make existing data available to mobile clients. In this case it's a requirement that database model (or *schema*) remain unchanged, in order for existing solutions to continue working.

This tutorial consists of the following sections:

1. [Exploring the existing database model](#ExistingModel)
2. [Creating data transfer objects (DTOs) for your mobile service](#DTOs)
3. [Establishing a mapping between DTOs and model](#Mapping)
4. [Implementing domain-specific logic](#DomainManager)
5. [Implementing a TableController using DTOs](#Controller)

<a name="ExistingModel"></a>
## Exploring the existing database model

For this tutorial we will use the database that was created with your mobile service, but we will not use the default model that is created. Instead, we will manually create an arbitrary model that will represent an existing application that you may have. For full details about how to connect to an on-premises database instead, check out [Connect to an on-premises SQL Server from an Azure mobile service using Hybrid Connections](mobile-services-dotnet-backend-hybrid-connections-get-started.md).

1. Start by creating a Mobile Services server project in **Visual Studio 2013 Update 2** or by using the quickstart project that you can download on the Mobile Services tab for your service in the [Azure Management Portal](http://manage.windowsazure.com). For the purposes of this tutorial, we will assume your server project name is **ShoppingService**.

2. Create a **Customer.cs** file inside the **Models** folder and use the following implementation. You will need to add an assembly reference to **System.ComponentModel.DataAnnotations** to your project.

        using System.Collections.Generic;
        using System.ComponentModel.DataAnnotations;

        namespace ShoppingService.Models
        {
            public class Customer
            {
                [Key]
                public int CustomerId { get; set; }
                
                public string Name { get; set; }

                public virtual ICollection<Order> Orders { get; set; }

            }
        }

3. Create an **Order.cs** file inside the **Models** folder and use the following implementation:
    
        using System.ComponentModel.DataAnnotations;

        namespace ShoppingService.Models
        {
            public class Order
            {
                [Key]
                public int OrderId { get; set; }

                public string Item { get; set; }

                public int Quantity { get; set; }

                public bool Completed { get; set; }

                public int CustomerId { get; set; }
              
                public virtual Customer Customer { get; set; }

            }
        }

    You will note that these two classes have a *relationship*: every **Order** is associated with a single **Customer** and a **Customer** can be associated with multiple **Orders**. Having relationships is common in existing data models.

4. Create an **ExistingContext.cs** file inside the **Models** folder and implement it as so:

        using System.Data.Entity;

        namespace ShoppingService.Models
        {
            public class ExistingContext : DbContext
            {
                public ExistingContext()
                    : base("Name=MS_TableConnectionString")
                {
                }

                public DbSet<Customer> Customers { get; set; }

                public DbSet<Order> Orders { get; set; }

            }
        }

The structure above approximates an existing Entity Framework model that you may already be using for an existing application. Please note that the model is not aware of Mobile Services in any way at this stage. 

<a name="DTOs"></a>
## Creating data transfer objects (DTOs) for your mobile service

The data model you would like to use with your mobile service may be arbitrarily complex; it could contain hundreds of entities with a variety of relationships between them. When building a mobile app, it is usually desirable to simplify the data model and eliminate relationships (or handle them manually) in order to minimize the payload being sent back and forth between the app and the service. In this section, we will create a set of simplified objects (known as "data transfer objects" or "DTOs"), that are mapped to the data you have in your database, yet contain only the minimal set of properties needed by your mobile app.

1. Create the **MobileCustomer.cs** file in the **DataObjects** folder of your service project and use the following implementation:

        using Microsoft.WindowsAzure.Mobile.Service;

        namespace ShoppingService.DataObjects
        {
            public class MobileCustomer : EntityData
            {
                public string Name { get; set; }
            }
        }

    Note that this class is similar to the **Customer** class in the model, except the relationship property to **Order** is removed. For an object to work correctly with Mobile Services offline sync, it needs a set of *system properties* for optimistic concurrency, so you will notice that the DTO inherits from [**EntityData**](http://msdn.microsoft.com/library/microsoft.windowsazure.mobile.service.entitydata.aspx), which contains those properties. The int-based **CustomerId** property from the original model is replaced by the string-based **Id** property from **EntityData**, which will be the **Id** that Mobile Services will use.

2. Create the **MobileOrder.cs** file in the **DataObjects** folder of your service project.

        using Microsoft.WindowsAzure.Mobile.Service;
        using Newtonsoft.Json;
        using System.ComponentModel.DataAnnotations;
        using System.ComponentModel.DataAnnotations.Schema;

        namespace ShoppingService.DataObjects
        {
            public class MobileOrder : EntityData
            {
                public string Item { get; set; }

                public int Quantity { get; set; }

                public bool Completed { get; set; }

                [NotMapped]
                public int CustomerId { get; set; }

                [Required]
                public string MobileCustomerId { get; set; }

                public string MobileCustomerName { get; set; }
            }
        }

    The **Customer** relationship property has been replaced with the **Customer** name and a **MobileCustomerId** property that can be used to manually model the relationship on the client. For now you can ignore the **CustomerId** property, it is only used later on. 

3. You might notice that with the addition of the system properties on the **EntityData** base class, our DTOs now have more properties than the model types. Clearly we need a place to store these properties, so we will add a few extra columns to the original database. While this does change the database, it will not break existing applications since the changes are purely additive (adding new columns to the schema). To do that, add the following statements to the top of **Customer.cs** and **Order.cs**:
    
        using System.ComponentModel.DataAnnotations.Schema;
        using Microsoft.WindowsAzure.Mobile.Service.Tables;
        using System.ComponentModel.DataAnnotations;
        using System;

    Then, add these extra properties to each of the classes:

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Index]
        [TableColumn(TableColumnType.CreatedAt)]
        public DateTimeOffset? CreatedAt { get; set; }

        [TableColumn(TableColumnType.Deleted)]
        public bool Deleted { get; set; }

        [Index]
        [TableColumn(TableColumnType.Id)]
        [MaxLength(36)]
        public string Id { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [TableColumn(TableColumnType.UpdatedAt)]
        public DateTimeOffset? UpdatedAt { get; set; }

        [TableColumn(TableColumnType.Version)]
        [Timestamp]
        public byte[] Version { get; set; }

4. The system properties just added have some built-in behaviors (for example automatic update of created/updated at) that happen transparently with database operations. To enable these behaviors, we need to make a change to **ExistingContext.cs**. At the top of the file, add the following:
    
        using System.Data.Entity.ModelConfiguration.Conventions;
        using Microsoft.WindowsAzure.Mobile.Service.Tables;
        using System.Linq;

    Then, in the body of **ExistingContext**, override [**OnModelCreating**](http://msdn.microsoft.com/library/system.data.entity.dbcontext.onmodelcreating.aspx):

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Add(
                new AttributeToColumnAnnotationConvention<TableColumnAttribute, string>(
                    "ServiceTableColumn", (property, attributes) => attributes.Single().ColumnType.ToString()));

            base.OnModelCreating(modelBuilder);
        } 

5. Let's populate the database with some example data. Open the file **WebApiConfig.cs**. Create a new [**IDatabaseInitializer**](http://msdn.microsoft.com/library/gg696323.aspx) and configure it in the **Register** method as shown below.

        using Microsoft.WindowsAzure.Mobile.Service;
        using ShoppingService.Models;
        using System;
        using System.Collections.Generic;
        using System.Collections.ObjectModel;
        using System.Data.Entity;
        using System.Web.Http;

        namespace ShoppingService
        {
            public static class WebApiConfig
            {
                public static void Register()
                {
                    ConfigOptions options = new ConfigOptions();

                    HttpConfiguration config = ServiceConfig.Initialize(new ConfigBuilder(options));

                    Database.SetInitializer(new ExistingInitializer());
                }
            }

            public class ExistingInitializer : ClearDatabaseSchemaIfModelChanges<ExistingContext>
            {
                protected override void Seed(ExistingContext context)
                {
                    List<Order> orders = new List<Order>
                    {
                        new Order { OrderId = 10, Item = "Guitars", Quantity = 2, Id = Guid.NewGuid().ToString()},
                        new Order { OrderId = 20, Item = "Drums", Quantity = 10, Id = Guid.NewGuid().ToString()},
                        new Order { OrderId = 30, Item = "Tambourines", Quantity = 20, Id = Guid.NewGuid().ToString() }
                    };

                    List<Customer> customers = new List<Customer>
                    {
                        new Customer { CustomerId = 1, Name = "John", Orders = new Collection<Order> { 
                            orders[0]}, Id = Guid.NewGuid().ToString()},
                        new Customer { CustomerId = 2, Name = "Paul", Orders = new Collection<Order> { 
                            orders[1]}, Id = Guid.NewGuid().ToString()},
                        new Customer { CustomerId = 3, Name = "Ringo", Orders = new Collection<Order> { 
                            orders[2]}, Id = Guid.NewGuid().ToString()},
                    };

                    foreach (Customer c in customers)
                    {
                        context.Customers.Add(c);
                    }

                    base.Seed(context);
                }
            }
        }

<a name="Mapping"></a>
## Establishing a mapping between DTOs and model

We now have the model types **Customer** and **Order** and the DTOs **MobileCustomer** and **MobileOrder**, but we  need to instruct the backend to automatically transform between the two. Here Mobile Services relies on [**AutoMapper**](http://automapper.org/), an object relational mapper, which is already referenced in the project.

1. Add the following to the top of **WebApiConfig.cs**:

        using AutoMapper;
        using ShoppingService.DataObjects;

2. To define the mapping, add the following to the **Register** method of the **WebApiConfig** class. 

        Mapper.Initialize(cfg =>
        {
            cfg.CreateMap<MobileOrder, Order>();
            cfg.CreateMap<MobileCustomer, Customer>();
            cfg.CreateMap<Order, MobileOrder>()
                .ForMember(dst => dst.MobileCustomerId, map => map.MapFrom(x => x.Customer.Id))
                .ForMember(dst => dst.MobileCustomerName, map => map.MapFrom(x => x.Customer.Name));
            cfg.CreateMap<Customer, MobileCustomer>();

        });

AutoMapper will now map the objects to one another. All properties with corresponding names will be matched, for example **MobileOrder.CustomerId** will get automatically mapped to **Order.CustomerId**. Custom mappings can be configured as shown above, where we map the **MobileCustomerName** property to the **Name** property of the **Customer** relationship property.

<a name="DomainManager"></a>
## Implementing domain-specific logic

The next step is to implement a [**MappedEntityDomainManager**](http://msdn.microsoft.com/library/dn643300.aspx), which serves as an abstraction layer between our mapped data store and the controller which will serve HTTP traffic from our clients. We will be able to write our controller in the next section purely in terms of the DTOs and the **MappedEntityDomainManager** we add here will handle the communication with the original data store, while also giving us a place to implement any logic specific to it.

1. Add a **MobileCustomerDomainManager.cs** to the **Models** folder of your project. Paste in the following implementation:

        using AutoMapper;
        using Microsoft.WindowsAzure.Mobile.Service;
        using ShoppingService.DataObjects;
        using System.Data.Entity;
        using System.Linq;
        using System.Net.Http;
        using System.Threading.Tasks;
        using System.Web.Http;
        using System.Web.Http.OData;

        namespace ShoppingService.Models
        {
            public class MobileCustomerDomainManager : MappedEntityDomainManager<MobileCustomer, Customer>
            {
                private ExistingContext context;

                public MobileCustomerDomainManager(ExistingContext context, HttpRequestMessage request, ApiServices services)
                    : base(context, request, services)
                {
                    Request = request;
                    this.context = context;
                }

                public static int GetKey(string mobileCustomerId, DbSet<Customer> customers, HttpRequestMessage request)
                {
                    int customerId = customers
                       .Where(c => c.Id == mobileCustomerId)
                       .Select(c => c.CustomerId)
                       .FirstOrDefault();

                    if (customerId == 0)
                    {
                        throw new HttpResponseException(request.CreateNotFoundResponse());
                    }
                    return customerId;
                }

                protected override T GetKey<T>(string mobileCustomerId)
                {
                    return (T)(object)GetKey(mobileCustomerId, this.context.Customers, this.Request);
                }
                
                public override SingleResult<MobileCustomer> Lookup(string mobileCustomerId)
                {
                    int customerId = GetKey<int>(mobileCustomerId);
                    return LookupEntity(c => c.CustomerId == customerId);
                }

                public override async Task<MobileCustomer> InsertAsync(MobileCustomer mobileCustomer)
                {
                    return await base.InsertAsync(mobileCustomer);
                }

                public override async Task<MobileCustomer> UpdateAsync(string mobileCustomerId, Delta<MobileCustomer> patch)
                {
                    int customerId = GetKey<int>(mobileCustomerId);

                    Customer existingCustomer = await this.Context.Set<Customer>().FindAsync(customerId);
                    if (existingCustomer == null)
                    {
                        throw new HttpResponseException(this.Request.CreateNotFoundResponse());
                    }

                    MobileCustomer existingCustomerDTO = Mapper.Map<Customer, MobileCustomer>(existingCustomer);
                    patch.Patch(existingCustomerDTO);
                    Mapper.Map<MobileCustomer, Customer>(existingCustomerDTO, existingCustomer);

                    await this.SubmitChangesAsync();

                    MobileCustomer updatedCustomerDTO = Mapper.Map<Customer, MobileCustomer>(existingCustomer);

                    return updatedCustomerDTO;
                }

                public override async Task<MobileCustomer> ReplaceAsync(string mobileCustomerId, MobileCustomer mobileCustomer)
                {
                    return await base.ReplaceAsync(mobileCustomerId, mobileCustomer);
                }

                public override async Task<bool> DeleteAsync(string mobileCustomerId)
                {
                    int customerId = GetKey<int>(mobileCustomerId);
                    return await DeleteItemAsync(customerId);
                }
            }
        }

    An important part of this class is the **GetKey** method where we indicate how to locate the ID property of the object in the original data model. 

2. Add a **MobileOrderDomainManager.cs** to the **Models** folder of your project:

        using AutoMapper;
        using Microsoft.WindowsAzure.Mobile.Service;
        using ShoppingService.DataObjects;
        using System.Linq;
        using System.Net.Http;
        using System.Threading.Tasks;
        using System.Web.Http;
        using System.Web.Http.OData;

        namespace ShoppingService.Models
        {
            public class MobileOrderDomainManager : MappedEntityDomainManager<MobileOrder, Order>
            {
                private ExistingContext context;

                public MobileOrderDomainManager(ExistingContext context, HttpRequestMessage request, ApiServices services)
                    : base(context, request, services)
                {
                    Request = request;
                    this.context = context;
                }

                protected override T GetKey<T>(string mobileOrderId)
                {
                    int orderId = this.context.Orders
                        .Where(o => o.Id == mobileOrderId)
                        .Select(o => o.OrderId)
                        .FirstOrDefault();

                    if (orderId == 0)
                    {
                        throw new HttpResponseException(this.Request.CreateNotFoundResponse());
                    }
                    return (T)(object)orderId;
                }

                public override SingleResult<MobileOrder> Lookup(string mobileOrderId)
                {
                    int orderId = GetKey<int>(mobileOrderId);
                    return LookupEntity(o => o.OrderId == orderId);
                }

                private async Task<Customer> VerifyMobileCustomer(string mobileCustomerId, string mobileCustomerName)
                {
                    int customerId = MobileCustomerDomainManager.GetKey(mobileCustomerId, this.context.Customers, this.Request);
                    Customer customer = await this.context.Customers.FindAsync(customerId);
                    if (customer == null)
                    {
                        throw new HttpResponseException(Request.CreateBadRequestResponse("Customer with name '{0}' was not found", mobileCustomerName));
                    }
                    return customer;
                }

                public override async Task<MobileOrder> InsertAsync(MobileOrder mobileOrder)
                {
                    Customer customer = await VerifyMobileCustomer(mobileOrder.MobileCustomerId, mobileOrder.MobileCustomerName);
                    mobileOrder.CustomerId = customer.CustomerId;
                    return await base.InsertAsync(mobileOrder);
                }

                public override async Task<MobileOrder> UpdateAsync(string mobileOrderId, Delta<MobileOrder> patch)
                {
                    Customer customer = await VerifyMobileCustomer(patch.GetEntity().MobileCustomerId, patch.GetEntity().MobileCustomerName);

                    int orderId = GetKey<int>(mobileOrderId);

                    Order existingOrder = await this.Context.Set<Order>().FindAsync(orderId);
                    if (existingOrder == null)
                    {
                        throw new HttpResponseException(this.Request.CreateNotFoundResponse());
                    }

                    MobileOrder existingOrderDTO = Mapper.Map<Order, MobileOrder>(existingOrder);
                    patch.Patch(existingOrderDTO);
                    Mapper.Map<MobileOrder, Order>(existingOrderDTO, existingOrder);

                    // This is required to map the right Id for the customer
                    existingOrder.CustomerId = customer.CustomerId;

                    await this.SubmitChangesAsync();

                    MobileOrder updatedOrderDTO = Mapper.Map<Order, MobileOrder>(existingOrder);

                    return updatedOrderDTO;
                }

                public override async Task<MobileOrder> ReplaceAsync(string mobileOrderId, MobileOrder mobileOrder)
                {
                    await VerifyMobileCustomer(mobileOrder.MobileCustomerId, mobileOrder.MobileCustomerName);

                    return await base.ReplaceAsync(mobileOrderId, mobileOrder);
                }

                public override Task<bool> DeleteAsync(string mobileOrderId)
                {
                    int orderId = GetKey<int>(mobileOrderId);
                    return DeleteItemAsync(orderId);
                }
            }
        }

    In this case the **InsertAsync** and **UpdateAsync** methods are interesting; that's where we enforce the relationship that each **Order** must have a valid associated **Customer**. In **InsertAsync** you'll notice that we populate the **MobileOrder.CustomerId** property, which maps to the **Order.CustomerId** property. We get that value by based looking up the **Customer** with the matching **MobileOrder.MobileCustomerId**. This is because by default the client is only aware of the Mobile Services ID (**MobileOrder.MobileCustomerId**) of the **Customer**, which is different than its actual primary key needed to set the foreign key (**MobileOrder.CustomerId**) from **Order** to **Customer**. This is only used internally within the service to facilitate the insert operation.

We are now ready to create controllers to expose our DTOs to our clients.

<a name="Controller"></a>
## Implementing a TableController using DTOs

1. In the **Controllers** folder, add the file **MobileCustomerController.cs**:

        using Microsoft.WindowsAzure.Mobile.Service;
        using Microsoft.WindowsAzure.Mobile.Service.Security;
        using ShoppingService.DataObjects;
        using ShoppingService.Models;
        using System.Linq;
        using System.Threading.Tasks;
        using System.Web.Http;
        using System.Web.Http.Controllers;
        using System.Web.Http.OData;

        namespace ShoppingService.Controllers
        {
            public class MobileCustomerController : TableController<MobileCustomer>
            {
                protected override void Initialize(HttpControllerContext controllerContext)
                {
                    base.Initialize(controllerContext);
                    var context = new ExistingContext();
                    DomainManager = new MobileCustomerDomainManager(context, Request, Services);
                }

                public IQueryable<MobileCustomer> GetAllMobileCustomers()
                {
                    return Query();
                }

                public SingleResult<MobileCustomer> GetMobileCustomer(string id)
                {
                    return Lookup(id);
                }

                [AuthorizeLevel(AuthorizationLevel.Admin)]
                protected override Task<MobileCustomer> PatchAsync(string id, Delta<MobileCustomer> patch)
                {
                    return base.UpdateAsync(id, patch);
                }

                [AuthorizeLevel(AuthorizationLevel.Admin)]
                protected override Task<MobileCustomer> PostAsync(MobileCustomer item)
                {
                    return base.InsertAsync(item);
                }

                [AuthorizeLevel(AuthorizationLevel.Admin)]
                protected override Task DeleteAsync(string id)
                {
                    return base.DeleteAsync(id);
                }
            }
        }

    You will note the use of the AuthorizeLevel attribute to restrict public access to the Insert/Update/Delete operations on the controller. For the purposes of this scenario, the list of Customers will be read-only, but we will allow the creation of new Orders and associating them with existing customers. 

2. In the **Controllers** folder, add the file **MobileOrderController.cs**:

        using Microsoft.WindowsAzure.Mobile.Service;
        using ShoppingService.DataObjects;
        using ShoppingService.Models;
        using System.Linq;
        using System.Threading.Tasks;
        using System.Web.Http;
        using System.Web.Http.Controllers;
        using System.Web.Http.Description;
        using System.Web.Http.OData;

        namespace ShoppingService.Controllers
        {
            public class MobileOrderController : TableController<MobileOrder>
            {
                protected override void Initialize(HttpControllerContext controllerContext)
                {
                    base.Initialize(controllerContext);
                    ExistingContext context = new ExistingContext();
                    DomainManager = new MobileOrderDomainManager(context, Request, Services);
                }

                public IQueryable<MobileOrder> GetAllMobileOrders()
                {
                    return Query();
                }

                public SingleResult<MobileOrder> GetMobileOrder(string id)
                {
                    return Lookup(id);
                }

                public Task<MobileOrder> PatchMobileOrder(string id, Delta<MobileOrder> patch)
                {
                    return UpdateAsync(id, patch);
                }

                [ResponseType(typeof(MobileOrder))]
                public async Task<IHttpActionResult> PostMobileOrder(MobileOrder item)
                {
                    MobileOrder current = await InsertAsync(item);
                    return CreatedAtRoute("Tables", new { id = current.Id }, current);
                }

                public Task DeleteMobileOrder(string id)
                {
                    return DeleteAsync(id);
                }
            }
        }

3. You are now ready to run your service. Press **F5** and use the test client built into the help page to modify the data.

Please note that both controller implementations make exclusive use of the DTOs **MobileCustomer** and **MobileOrder** and are agnostic of the underlying model. These DTOs are readily serialized to JSON and can be used to exchange data with the  Mobile Services client SDK on all platforms. For example, if building a Windows Store app, the corresponding client-side type would look as shown below. The type would be analogous on other client platforms. 

    using Microsoft.WindowsAzure.MobileServices;
    using System;

    namespace ShoppingClient
    {
        public class MobileCustomer
        {
            public string Id { get; set; }

            public string Name { get; set; }

            [CreatedAt]
            public DateTimeOffset? CreatedAt { get; set; }

            [UpdatedAt]
            public DateTimeOffset? UpdatedAt { get; set; }

            public bool Deleted { get; set; }
            
            [Version]
            public string Version { get; set; }

        }

    }

As a next step, you can now build out the client app to access the service. 