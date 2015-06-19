<properties 
	pageTitle="Creating a Leaderboard App with Azure Mobile Services .NET Backend" 
	description="Learn how to build a Windows Store app using Azure Mobile Services with a .NET backend." 
	documentationCenter="windows" 
	authors="MikeWasson" 
	manager="dwrede" 
	editor="" 
	services="mobile-services"/>

<tags 
	ms.service="mobile-services" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-store" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="02/23/2015" 
	ms.author="mwasson"/>

# Creating a Leaderboard App with Azure Mobile Services .NET Backend

This tutorial shows how build a Windows Store app using Azure Mobile Services with a .NET backend. Azure Mobile Services provides a scalable and secure backend with built-in authentication, monitoring, push notifications, and other features, plus a cross-platform client library for building mobile apps. The .NET backend for Mobile Services is based on [ASP.NET Web API](http://asp.net/web-api), and gives .NET developers a first-class way to create REST APIs.   

## Overview

Web API is an open-source framework that gives .NET developers a first-class way to create REST APIs. You can host a Web API solution on Azure Websites, on Azure Mobile Services using the .NET backend, or even self-hosted in a custom process. Mobile Services is a hosting environment that is designed especially for mobile apps. When you host your Web API service on Mobile Services, you get the following advantages in addition to data storage:

- Built-in authentication with social providers and Azure Active Directory (AAD). 
- Push notifications to apps using device-specific notification services.
- A full set of client libraries that make it easy to access your service from any app. 
- Built-in logging and diagnostics.

In this tutorial you will:

- Create a REST API using Azure Mobile Services.
- Publish the service to Azure.
- Create a Windows Store app that consumes the service.
- Use Entity Framework (EF) to create foreign key relations and data transfer objects (DTOs).
- Use ASP.NET Web API to define a custom API.

This tutorial uses [Visual Studio 2013 latest update](http://go.microsoft.com/fwlink/p/?LinkID=390465). 


## About the sample app

A *leaderboard* shows a list of players for a game, along with their scores and the rank of each player. A leaderboard might be part of a larger game, or could be a separate app. A leaderboard is a real-world application, but is simple enough for a tutorial. Here is a screen shot of the app:

![][1]

To keep the app simple, there is no actual game. Instead, you can add players and submit a score for each player. When you submit a score, the mobile service calculates the new rankings. On the back end, the mobile service creates a database with two tables:

- Player. Contains the player ID and name.
- PlayerRank. Contains a player's score and rank.

PlayerRank has a foreign key to Player. Each player has zero or one PlayerRank.

In a real leaderboard app, PlayerRank might also have a game ID, so that a player could submit scores for more than one game.

![][2]

The client app can perform the full set of CRUD operations on Players. It can read or delete existing PlayerRank entities, but it cannot create or update them directly. That's because the rank value is calculated by the service. Instead, the client submits a score, and the service updates the ranks for all players.

Download the completed project [here](http://code.msdn.microsoft.com/Leaderboard-App-with-Azure-9acf63af).


## Create the project

Launch Visual Studio and create a new ASP.NET Web Application project. Name the project Leaderboard.

![][3]

In Visual Studio 2013, the ASP.NET Web Application project includes a template for Azure Mobile Service. Select this template and click **OK**.

![][4]
 
The project template includes an example controller and data object.  

![][5]
 
These aren't needed for the tutorial, so you can delete them from the project. Also remove the references to TodoItem  in WebApiConfig.cs and LeaderboardContext.cs.

## Add data models

You will use [EF Code First](http://msdn.microsoft.com/data/ee712907#codefirst) to define the database tables. Under the DataObjects folder, add a class named `Player`.

	using Microsoft.WindowsAzure.Mobile.Service;
	
	namespace Leaderboard.DataObjects
	{
	    public class Player : EntityData
	    {
	        public string Name { get; set; }
	    }
	}

Add another class named `PlayerRank`.

	using Microsoft.WindowsAzure.Mobile.Service;
	using System.ComponentModel.DataAnnotations.Schema;
	
	namespace Leaderboard.DataObjects
	{
	    public class PlayerRank : EntityData
	    {
	        public int Score { get; set; }
	        public int Rank { get; set; }
	
	        [ForeignKey("Id")]
	        public virtual Player Player { get; set; }
	    }
	}

Notice that both classes inherit from the **EntityData** class. Deriving from **EntityData** makes it easy for the app consume the data, using the cross-platform client library for Azure Mobile Services. **EntityData** also makes it easier for an app to [handle database write conflicts](http://azure.microsoft.commobile-services-windows-store-dotnet-handle-database-conflicts.md).

The `PlayerRank` class has a [navigation property](http://msdn.microsoft.com/data/jj713564.aspx) that points to the related `Player` entity. The **[ForeignKey]** attribute tells EF that the `Player` property represents a foreign key.

# Add Web API controllers

Next, you will add Web API controllers for `Player` and `PlayerRank`. Instead of plain Web API controllers, you will add a special kind of controller called a *table controller*, designed specifically for Azure Mobile Services.

Right click the Controllers folder >  **Add** > **New Scaffolded Item**.

![][6] 

In the **Add Scaffold** dialog, expand **Common** on the left and select **Azure Mobile Services**. Then select **Azure Mobile Services Table Controller**. Click **Add**.

![][7] 
 
In the **Add Controller** dialog:

1.	Under **Model class**, select Player. 
2.	Under **Data context class**, select MobileServiceContext.
3.	Name the controller "PlayerController".
4.	Click **Add**.


This step adds a file named PlayerController.cs to the project.

![][8] 

The controller derives from **TableController<T>**. This class inherits **ApiController**, but is specialized for Azure Mobile Services.
 
- Routing: The default route for a **TableController** is `/tables/{table_name}/{id}`, where *table_name* matches the entity name. So the route for the Player controller is */tables/player/{id}*. This routing convention makes **TableController** consistent with the Mobile Services [REST API](http://msdn.microsoft.com/library/azure/jj710104.aspx).
- Data access: For database operations, the **TableController** class uses the **IDomainManager** interface, which defines an abstraction for data access.  The scaffolding uses **EntityDomainManager**, which is a concrete implementation of **IDomainManager** that wraps an EF context. 

Now add a second controller for PlayerRank entities. Follow the same steps, but choose PlayerRank for the model class. Use the same data context class; don't create a new one. Name the controller "PlayerRankController".

## Use a DTO to return related entities

Recall that `PlayerRank` has a related `Player` entity: 

    public class PlayerRank : EntityData
    {
        public int Score { get; set; }
        public int Rank { get; set; }

        [ForeignKey("Id")]
        public virtual Player Player { get; set; }
    }

The Mobile Service client library does not support navigation properties, and they will not be serialized. For example, here is the raw HTTP response for GET `/tables/PlayerRank`:

	HTTP/1.1 200 OK
	Cache-Control: no-cache
	Pragma: no-cache
	Content-Length: 97
	Content-Type: application/json; charset=utf-8
	Expires: 0
	Server: Microsoft-IIS/8.0
	Date: Mon, 21 Apr 2014 17:58:43 GMT
	
	[{"id":"1","rank":1,"score":150},{"id":"2","rank":3,"score":100},{"id":"3","rank":1,"score":150}]

Notice that `Player` is not included in the object graph. To include the player, we can flatten the object graph by defining a *data transfer object* (DTO). 

A DTO is an object that defines how data is sent over the network. DTOs are useful whenever you want the wire format to look different than your database model. To create a DTO for `PlayerRank`, add a new class named `PlayerRankDto` in the DataObjects folder.

	namespace Leaderboard.DataObjects
	{
	    public class PlayerRankDto
	    {
	        public string Id { get; set; }
	        public string PlayerName { get; set; }
	        public int Score { get; set; }
	        public int Rank { get; set; }
	    }
	}

In the `PlayerRankController` class, we'll use the LINQ **Select** method to convert `PlayerRank` instances to `PlayerRankDto` instances. Update the `GetAllPlayerRank` and `GetPlayerRank` controller methods as follows:

	// GET tables/PlayerRank
	public IQueryable<PlayerRankDto> GetAllPlayerRank()
	{
	    return Query().Select(x => new PlayerRankDto()
	    {
	        Id = x.Id,
	        PlayerName = x.Player.Name,
	        Score = x.Score,
	        Rank = x.Rank
	    });
	}
	
	// GET tables/PlayerRank/48D68C86-6EA6-4C25-AA33-223FC9A27959
	public SingleResult<PlayerRankDto> GetPlayerRank(string id)
	{
	    var result = Lookup(id).Queryable.Select(x => new PlayerRankDto()
	    {
	        Id = x.Id,
	        PlayerName = x.Player.Name,
	        Score = x.Score,
	        Rank = x.Rank
	    });
	
	    return SingleResult<PlayerRankDto>.Create(result);
	}

With these changes, the two GET methods return `PlayerRankDto` objects to the client. The `PlayerRankDto.PlayerName` property is set to the player name. Here is an example response after making this change:

	HTTP/1.1 200 OK
	Cache-Control: no-cache
	Pragma: no-cache
	Content-Length: 160
	Content-Type: application/json; charset=utf-8
	Expires: 0
	Server: Microsoft-IIS/8.0
	Date: Mon, 21 Apr 2014 19:57:08 GMT
	
	[{"id":"1","playerName":"Alice","score":150,"rank":1},{"id":"2","playerName":"Bob","score":100,"rank":3},{"id":"3","playerName":"Charles","score":150,"rank":1}]

Notice that the JSON payload now includes the player names.

Instead of using LINQ Select statements, another option is to use AutoMapper. This option requires some additional setup code, but enables automatic mapping from domain entities to DTOs. For more information, see [Mapping between Database Types and Client Types in the .NET Backend using AutoMapper](http://blogs.msdn.com/b/azuremobile/archive/2014/05/19/mapping-between-database-types-and-client-type-in-the-net-backend-using-automapper.aspx).

## Define a custom API to submit scores

The `PlayerRank` entity includes a `Rank` property. This value is calculated by the server, and we don't want clients setting it. Instead, clients will use a custom API to submit a player's score.  When the server gets a new score, it will update all of the player ranks.

First, add a class named `PlayerScore` to the DataObjects folder.

	namespace Leaderboard.DataObjects
	{
	    public class PlayerScore
	    {
	        public string PlayerId { get; set; }
	        public int Score { get; set; }
	    }
	}

In the `PlayerRankController` class, move the `MobileServiceContext` variable from the constructor to a class variable:

    public class PlayerRankController : TableController<PlayerRank>
    {
        // Add this:
        MobileServiceContext context = new MobileServiceContext();

        protected override void Initialize(HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);

            // Delete this:
            // MobileServiceContext context = new MobileServiceContext();
            DomainManager = new EntityDomainManager<PlayerRank>(context, Request, Services);
        }


Delete the following methods from `PlayerRankController`:

- `PatchPlayerRank` 
- `PostPlayerRank` 
- `DeletePlayerRank`

Then add the following code to `PlayerRankController`:

    [Route("api/score")]
    public async Task<IHttpActionResult> PostPlayerScore(PlayerScore score)
    {
        // Does this player exist?
        var count = context.Players.Where(x => x.Id == score.PlayerId).Count();
        if (count < 1)
        {
            return BadRequest();
        }

        // Try to find the PlayerRank entity for this player. If not found, create a new one.
        PlayerRank rank = await context.PlayerRanks.FindAsync(score.PlayerId);
        if (rank == null)
        {
            rank = new PlayerRank { Id = score.PlayerId };
            rank.Score = score.Score;
            context.PlayerRanks.Add(rank);
        }
        else
        {
            rank.Score = score.Score;
        }

        await context.SaveChangesAsync();

        // Update rankings
        // See http://stackoverflow.com/a/575799
        const string updateCommand =
            "UPDATE r SET Rank = ((SELECT COUNT(*)+1 from {0}.PlayerRanks " +
            "where Score > (select score from {0}.PlayerRanks where Id = r.Id)))" +
            "FROM {0}.PlayerRanks as r";

        string command = String.Format(updateCommand, ServiceSettingsDictionary.GetSchemaName());
        await context.Database.ExecuteSqlCommandAsync(command);

        return Ok();
    }

The `PostPlayerScore` method takes a `PlayerScore` instance as input. (The client will send the `PlayerScore` in an HTTP POST request.) The method does the following:

1.	Adds a new `PlayerRank` for the player, if there isn't one in the database already.
2.	Updates the player's score.
3.	Run a SQL query that batch updates all of the player ranks.

The **[Route]** attribute defines a custom route for this method:

	[Route("api/score")]

You could also put the method into a separate controller. There is no particular advantage either way, it just depends how you want to organize your code.
To learn more about the **[Route]** attribute, see [Attribute Routing in Web API](http://www.asp.net/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2).

## Create the Windows Store app

In this section, I'll describe the Windows Store app that consumes the mobile service. However, I won't focus much on the XAML or the UI. Instead, I want to focus on the application logic. You can download the complete project [here](http://code.msdn.microsoft.com/Leaderboard-App-with-Azure-9acf63af).

Add a new Windows Store App project to the solution. I used the Blank App (Windows) template. 

![][10]
 
Use NuGet Package Manager to add the Mobile Services client library. In Visual Studio, from the **Tools** menu, select **NuGet Package Manager**. Then select **Package Manager Console**. In the Package Manager Console window, type the following command.

	Install-Package WindowsAzure.MobileServices -Project LeaderboardApp

The -Project switch specifies which project to install the package to.

## Add model classes

Create a folder named Models and add the following classes:

	namespace LeaderboardApp.Models
	{
	    public class Player
	    {
	        public string Id { get; set; }
	        public string Name { get; set; }
	    }
	
	    public class PlayerRank
	    {
	        public string Id { get; set; }
	        public string PlayerName { get; set; }
	        public int Score { get; set; }
	        public int Rank { get; set; }
	    }
	
	    public class PlayerScore
	    {
	        public string PlayerId { get; set; }
	        public int Score { get; set; }
	    }
	}

These classes correspond directly to the data entities in the mobile service.
 
## Create a view model

Model-View-ViewModel (MVVM) is a variant of Model-View-Controller (MVC). The MVVM pattern helps separate application logic from presentation.

- The model represents the domain data (player, player rank, and player score).
- The view model is an abstract representation of the view. 
- The view displays the view model and sends user input to the view model. For a Windows Store app, the view is defined in XAML.

![][11] 

Add a class named `LeaderboardViewModel`.

	using LeaderboardApp.Models;
	using Microsoft.WindowsAzure.MobileServices;
	using System.ComponentModel;
	using System.Net.Http;
	using System.Threading.Tasks;
	
	namespace LeaderboardApp.ViewModel
	{
	    class LeaderboardViewModel : INotifyPropertyChanged
	    {
	        MobileServiceClient _client;
	
	        public LeaderboardViewModel(MobileServiceClient client)
	        {
	            _client = client;
	        }
	    }
	}

Implement **INotifyPropertyChanged** on the view model, so the view model can participate in data binding. 

    class LeaderboardViewModel : INotifyPropertyChanged
    {
        MobileServiceClient _client;

        public LeaderboardViewModel(MobileServiceClient client)
        {
            _client = client;
        }

        // New code:
        // INotifyPropertyChanged implementation
        public event PropertyChangedEventHandler PropertyChanged;

        public void NotifyPropertyChanged(string propertyName)
        {
            if (PropertyChanged != null)
            {
                PropertyChanged(this,
                    new PropertyChangedEventArgs(propertyName));
            }
        }    
    }

Next, add observable properties. The XAML will data bind to these properties. 

    class LeaderboardViewModel : INotifyPropertyChanged
    {
        // ...

        // New code:
        // View model properties
        private MobileServiceCollection<Player, Player> _Players;
        public MobileServiceCollection<Player, Player> Players
        {
            get { return _Players; }
            set
            {
                _Players = value;
                NotifyPropertyChanged("Players");
            }
        }

        private MobileServiceCollection<PlayerRank, PlayerRank> _Ranks;
        public MobileServiceCollection<PlayerRank, PlayerRank> Ranks
        {
            get { return _Ranks; }
            set
            {
                _Ranks = value;
                NotifyPropertyChanged("Ranks");
            }
        }

        private bool _IsPending;
        public bool IsPending
        {
            get { return _IsPending; }
            set
            {
                _IsPending = value;
                NotifyPropertyChanged("IsPending");
            }
        }

        private string _ErrorMessage = null;
        public string ErrorMessage
        {
            get { return _ErrorMessage; }
            set
            {
                _ErrorMessage = value;
                NotifyPropertyChanged("ErrorMessage");
            }
        }
    }

The `IsPending` property is true while an async operation is pending on the service. The `ErrorMessage` property holds any error message from the service. 

Finally, add methods that call through to the service layer. 

    class LeaderboardViewModel : INotifyPropertyChanged
    {
        // ...

        // New code:
        // Service operations
        public async Task GetAllPlayersAsync()
        {
            IsPending = true;
            ErrorMessage = null;

            try
            {
                IMobileServiceTable<Player> table = _client.GetTable<Player>();
                Players = await table.OrderBy(x => x.Name).ToCollectionAsync();
            }
            catch (MobileServiceInvalidOperationException ex)
            {
                ErrorMessage = ex.Message;
            }
            catch (HttpRequestException ex2)
            {
                ErrorMessage = ex2.Message;
            }
            finally
            {
                IsPending = false;
            }
        }

        public async Task AddPlayerAsync(Player player)
        {
            IsPending = true;
            ErrorMessage = null;

            try
            {
                IMobileServiceTable<Player> table = _client.GetTable<Player>();
                await table.InsertAsync(player);
                Players.Add(player);
            }
            catch (MobileServiceInvalidOperationException ex)
            {
                ErrorMessage = ex.Message;
            }
            catch (HttpRequestException ex2)
            {
                ErrorMessage = ex2.Message;
            }
            finally
            {
                IsPending = false;
            }
        }

        public async Task SubmitScoreAsync(Player player, int score)
        {
            IsPending = true;
            ErrorMessage = null;

            var playerScore = new PlayerScore()
            {
                PlayerId = player.Id,
                Score = score
            }; 
            
            try
            {
                await _client.InvokeApiAsync<PlayerScore, object>("score", playerScore);
                await GetAllRanksAsync();
            }
            catch (MobileServiceInvalidOperationException ex)
            {
                ErrorMessage = ex.Message;
            }
            catch (HttpRequestException ex2)
            {
                ErrorMessage = ex2.Message;
            }
            finally
            {
                IsPending = false;
            }
        }

        public async Task GetAllRanksAsync()
        {
            IsPending = true;
            ErrorMessage = null;

            try
            {
                IMobileServiceTable<PlayerRank> table = _client.GetTable<PlayerRank>();
                Ranks = await table.OrderBy(x => x.Rank).ToCollectionAsync();
            }
            catch (MobileServiceInvalidOperationException ex)
            {
                ErrorMessage = ex.Message;
            }
            catch (HttpRequestException ex2)
            {
                ErrorMessage = ex2.Message;
            }
            finally
            {
                IsPending = false;
            }
         }    
    }

## Add a MobileServiceClient instance

Open the *App.xaml.cs*file and add a **MobileServiceClient** instance to the `App` class.

	// New code:
	using Microsoft.WindowsAzure.MobileServices;
	
	namespace LeaderboardApp
	{
	    sealed partial class App : Application
	    {
	        // New code.
	        // TODO: Replace 'port' with the actual port number.
	        const string serviceUrl = "http://localhost:port/";
	        public static MobileServiceClient MobileService = new MobileServiceClient(serviceUrl);
	
	
	        // ...
	    }
	}

When you debug locally, the mobile service runs on IIS express. Visual Studio assigns a random port number, so the local URL is http://localhost:*port*, where *port* is the port number. To get the port number, start the service in Visual Studio by pressing F5 to debug. Visual Studio will launch a browser and navigate to the service URL.  You can also find the local URL in the project properties, under **Web**.

## Create the main page

In the main page, add an instance of the view model. Then set the view model as the **DataContext** for the page.

    public sealed partial class MainPage : Page
    {
        // New code:
        LeaderboardViewModel viewModel = new LeaderboardViewModel(App.MobileService);

        public MainPage()
        {
            this.InitializeComponent();
            // New code:
            this.DataContext = viewModel;
        }

       // ...


As I mentioned earlier, I won't show all of the XAML for the app. One benefit of the MVVM pattern is to separate presentation from app logic, so it's easy to change the UI, if you don't like the sample app.

The list of players is displayed in a **ListBox**:

	<ListBox Width="200" Height="400" x:Name="PlayerListBox" 
	    ItemsSource="{Binding Players}" DisplayMemberPath="Name"/>

Rankings are displayed in a **ListView**:

	<ListView x:Name="RankingsListView" ItemsSource="{Binding Ranks}" SelectionMode="None">
	    <!-- Header and styles not shown -->
	    <ListView.ItemTemplate>
	        <DataTemplate>
	            <Grid>
	                <Grid.ColumnDefinitions>
	                    <ColumnDefinition Width="*"/>
	                    <ColumnDefinition Width="2*"/>
	                    <ColumnDefinition Width="*"/>
	                </Grid.ColumnDefinitions>
	                <TextBlock Text="{Binding Path=Rank}"/>
	                <TextBlock Text="{Binding Path=PlayerName}" Grid.Column="1"/>
	                <TextBlock Text="{Binding Path=Score}" Grid.Column="2"/>
	            </Grid>
	        </DataTemplate>
	    </ListView.ItemTemplate>
	</ListView>

All data binding happens through the view model.

## Publish your mobile service

In this step, you will publish your mobile service to Microsoft Azure and modify the app to use the live service.

In Solution Explorer, right-click the Leaderboard project and select **Publish**.
 
![][12]

In the **Publish** dialog, click **Azure Mobile Services**.

![][13]
 
If you are not signed into your Azure account already, click **Sign In**.

![][14]


Select an existing Mobile Service, or click **New** to create a new one. Then click **OK** to publish.

![][15]
 
The publishing process automatically creates the database. You don't need to configure a connection string.

Now you are ready to connect the leaderboard app to the live service. You need two things:

- The URL of the service
- The application key

You can get both from the Azure Management Portal. In the Management Portal, click **Mobile Services**, and then click the mobile service. The service URL is listed on the dashboard tab. To get the application key, click **Manage Keys**.

![][16]
 
In the **Manage Access Keys** dialog, copy the value for the application key.

![][17]

 
Pass the service URL and the application key to the **MobileServiceClient** constructor.

    sealed partial class App : Application
    {
        // TODO: Replace these strings with the real URL and key.
        const string serviceUrl = "https://yourapp.azure-mobile.net/";
        const string appKey = "YOUR ACCESSS KEY";

        public static MobileServiceClient MobileService = new MobileServiceClient(serviceUrl, appKey);

       // ...

Now when you run the app, it communicates with the real service. 

## Next Steps

* [Learn more about Azure Mobile Services]
* [Learn more about Web API]
* [Handle database write conflicts]
* [Add push notifications]; for example, when someone adds a new player or updates a score.
* [Get started with authentication]

<!-- Anchors. -->
[Overview]: #overview
[About the sample app]: #about-the-sample-app
[Create the project]: #create-the-project
[Add data models]: #add-data-models
[Add Web API controllers]: #add-web-api-controllers
[Use a DTO to return related entities]: #use-a-dto-to-return-related-entities
[Define a custom API to submit scores]: #define-a-custom-api-to-submit-scores
[Create the Windows Store app]: #create-the-windows-store-app
[Add model classes]: #add-model-classes
[Create a view model]: #create-a-view-model
[Add a MobileServiceClient instance]: #add-a-mobileserviceclient-instance
[Create the main page]: #create-the-main-page
[Publish your mobile service]: #publish-your-mobile-service
[Next Steps]: #next-steps

<!-- Images. -->

[1]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/01leaderboard.png
[2]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/02leaderboard.png
[3]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/03leaderboard.png
[4]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/04leaderboard.png
[5]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/05leaderboard.png
[6]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/06leaderboard.png
[7]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/07leaderboard.png
[8]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/08leaderboard.png
[9]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/09leaderboard.png
[10]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/10leaderboard.png
[11]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/11leaderboard.png
[12]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/12leaderboard.png
[13]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/13leaderboard.png
[14]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/14leaderboard.png
[15]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/15leaderboard.png
[16]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/16leaderboard.png
[17]: ./media/mobile-services-dotnet-backend-windows-store-dotnet-leaderboard/17leaderboard.png

<!-- URLs. -->

[Learn more about Azure Mobile Services]: /develop/mobile/resources/
[Learn more about Web API]: http://asp.net/web-api
[Handle database write conflicts]: mobile-services-windows-store-dotnet-handle-database-conflicts.md
[Add push notifications]: notification-hubs-windows-store-dotnet-get-started.md
[Get started with authentication]: /develop/mobile/tutorials/get-started-with-users-dotnet

