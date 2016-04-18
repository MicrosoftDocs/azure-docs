<properties 
	pageTitle="How to create a Web App with Redis Cache | Microsoft Azure" 
	description="Learn how to create a Web App with Redis Cache" 
	services="redis-cache" 
	documentationCenter="" 
	authors="steved0x" 
	manager="douge" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/15/2016" 
	ms.author="sdanie"/>

# How to create a Web App with Redis Cache

Procedural steps only for tech review

## Create the Visual Studio project



1. Open Visual Studio and click **File**, **New**, **Project**.

2. Expand the **Visual C#** node in the **Templates** list, select **Cloud**, and click **ASP.NET Web Application**. Type **ContosoTeamStats** into the **Name** textbox and click **OK**.
 
    ![Create project][cache-create-project]

3. Select **MVC** as the project type. Clear the **Host in the cloud** checkbox. We will provision the Azure resources and publish the application to Azure later in the tutorial. 

    ![Select project template][cache-select-template]

4. Click **OK** to create the project.

## Add the model

1. Right-click **Models** in **Solution Explorer**, and choose **Add**, **Class**. 

    ![Add model][cache-model-add-class]

2. Enter `Team` for the class name and click **Add**.

    ![Add model class][cache-model-add-class-dialog]

3. Replace the `using` statements at the top of the `Team.cs` file with the following using statements.


		using System;
		using System.Collections.Generic;
		using System.Data.Entity;
		using System.Data.Entity.SqlServer;


4. Replace the definition of the `Team` class with the following code snippet that contains an updated `Team` class definition as well as some other Entity Framework helper classes. For more information on the code first approach to Entity Framework that's used in this tutorial, see [Code first to a new database](https://msdn.microsoft.com/data/jj193542).


		public class Team
		{
		    public int ID { get; set; }
		    public string Name { get; set; }
		    public int Wins { get; set; }
		    public int Losses { get; set; }
		    public int Ties { get; set; }
		
		    static public void PlayGames(IEnumerable<Team> teams)
		    {
		        // Simple random generation of statistics
		        Random r = new Random();
		
		        foreach (var t in teams)
		        {
		            t.Wins = r.Next(33);
		            t.Losses = r.Next(33);
		            t.Ties = r.Next(0, 5);
		        }
		    }
		}
		
		public class TeamContext : DbContext
		{
		    public TeamContext()
		        : base("TeamContext")
		    {
		    }
		
		    public DbSet<Team> Teams { get; set; }
		}
		
		public class TeamInitializer : CreateDatabaseIfNotExists<TeamContext>
		{
		    protected override void Seed(TeamContext context)
		    {
		        var teams = new List<Team>
		        {
		            new Team{Name="Adventure Works Cycles"},
		            new Team{Name="Alpine Ski House"},
		            new Team{Name="Blue Yonder Airlines"},
		            new Team{Name="Coho Vineyard"},
		            new Team{Name="Contoso, Ltd."},
		            new Team{Name="Fabrikam, Inc."},
		            new Team{Name="Lucerne Publishing"},
		            new Team{Name="Northwind Traders"},
		            new Team{Name="Consolidated Messenger"},
		            new Team{Name="Fourth Coffee"},
		            new Team{Name="Graphic Design Institute"},
		            new Team{Name="Nod Publishers"}
		        };
		
		        Team.PlayGames(teams);
		
		        teams.ForEach(t => context.Teams.Add(t));
		        context.SaveChanges();
		    }
		}
		
		public class TeamConfiguration : DbConfiguration
		{
		    public TeamConfiguration()
		    {
		        SetExecutionStrategy("System.Data.SqlClient", () => new SqlAzureExecutionStrategy());
		    }
		}


2. In **Solution Explorer** double-click **web.config** and add the following connection string to the `connectionStrings` section. The name of the connection string must match the name of the Entity Framework database context class which is `TeamContext`.

		<add name="TeamContext" connectionString="Data Source=(LocalDB)\v11.0;AttachDbFilename=|DataDirectory|\Teams.mdf;Integrated Security=True" providerName="System.Data.SqlClient" />


    After adding this, the `connectionStrings` section should look like the following example.


		<connectionStrings>
			<add name="DefaultConnection" connectionString="Data Source=(LocalDb)\MSSQLLocalDB;AttachDbFilename=|DataDirectory|\aspnet-ContosoTeamStats-20160216120918.mdf;Initial Catalog=aspnet-ContosoTeamStats-20160216120918;Integrated Security=True"
				providerName="System.Data.SqlClient" />
			<add name="TeamContext" connectionString="Data Source=(LocalDB)\v11.0;AttachDbFilename=|DataDirectory|\Teams.mdf;Integrated Security=True" 	providerName="System.Data.SqlClient" />
		</connectionStrings>

## Add the controller


1. Press **F6** to build the project. 
2. In **Solution Explorer**, right-click the **Controllers** folder and choose **Add**, **Controller**.

    ![Add controller][cache-add-controller]

3. Choose **MVC 5 Controller with views, using Entity Framework**, and click **Add**. If you get an error after clicking **Add**, ensure that you have built the project first.

    ![Add controller class][cache-add-controller-class]

5. Select **Team (ContosoTeamStats.Models)** from the **Model class** drop-down list. Select **TeamContext (ContosoTeamStats.Models)** from the **Data context class** drop-down list. Type `TeamsController` in the **Controller** name textbox (if it is not automatically populated). Click **Add** to create the controller class and add the default views.

    ![Configure controller][cache-configure-controller]

4. In **Solution Explorer**, expand **Global.asax** and double-click **Global.asax.cs** to open it.

    ![Global.asax.cs][cache-global-asax]

5. Add the following two using statements at the top of the file under the other using statements.


        using System.Data.Entity;
		using ContosoTeamStats.Models;


6. Add the following line of code at the end of the `Application_Start` method.


	    Database.SetInitializer<TeamContext>(new TeamInitializer());


7. In **Solution Explorer**, expand `App_Start` and double-click `RouteConfig.cs`.

    ![RouteConfig.cs][cache-RouteConfig-cs]

8. Replace `controller = "Home"` in the following code in the `RegisterRoutes` method with `controller = "Teams"` as shown in the following example.


	    routes.MapRoute(
	        name: "Default",
	        url: "{controller}/{action}/{id}",
	        defaults: new { controller = "Teams", action = "Index", id = UrlParameter.Optional }
	    );


## Configure the views

1. In **Solution Explorer**, expand the **Views** folder and then the **Shared** folder, and double-click **_Layout.cshtml**. 

    ![_Layout.cshtml][cache-layout-cshtml]

2. Change the contents of the `title` element and replace `My ASP.NET Application` with `Contoso Team Stats` as shown in the following example.


	    <title>@ViewBag.Title - Contoso Team Stats</title>


In the `body` section, update the first `Html.ActionLink` statement and replace `Application name` with `Contoso Team Stats` and replace `Home` with `Teams`.

Before: `@Html.ActionLink("Application name", "Index", "Home", new { area = "" }, new { @class = "navbar-brand" })`
After: `@Html.ActionLink("Contoso Team Stats", "Index", "Teams", new { area = "" }, new { @class = "navbar-brand" })`

TODO I wish there was a way to call out sections of code - I am working on this and will show a more complete example here with callouts.

	<body>
	    <div class="navbar navbar-inverse navbar-fixed-top">
	        <div class="container">
	            <div class="navbar-header">
	                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
	                    <span class="icon-bar"></span>
	                    <span class="icon-bar"></span>
	                    <span class="icon-bar"></span>
	                </button>
	                @Html.ActionLink("Contoso Team Stats", "Index", "Teams", new { area = "" }, new { @class = "navbar-brand" })
	            </div>


	




Press **Ctrl+F5** to build and run the application. This version of the application reads the results directly from the database. In the next section we'll add Redis Cache to the application.

![Starter application][cache-starter-application]

## Add Redis Cache to the application

TODO These first few steps are abbreviated for now. I am thinking of supplying powershell cmdlets or maybe an ARM  template

Create a Redis Cache in the region in which you want to host your Web App by following these directions: https://azure.microsoft.com/en-us/documentation/articles/cache-dotnet-how-to-use-azure-redis-cache/#create-a-cache

Add the StackExchange.Redis NuGet package to your project by following these directions: https://azure.microsoft.com/en-us/documentation/articles/cache-dotnet-how-to-use-azure-redis-cache/#configure-the-cache-clients

In **Solution Explorer**, expand the **Controllers** folder and double-click **TeamsController.cs** to open it.

Add the following using statement to **TeamsController.cs**.

	using StackExchange.Redis;

Add the following two properties to the `TeamsController` class.

    // Redis Connection string info
    private static Lazy<ConnectionMultiplexer> lazyConnection = new Lazy<ConnectionMultiplexer>(() =>
    {
        //string cacheString = ConfigurationManager.ConnectionStrings["Cache"].ToString();
        return ConnectionMultiplexer.Connect("<your cache name>.redis.cache.windows.net,abortConnect=false,ssl=true,password=<primary or secondary key of your cache");
        //return ConnectionMultiplexer.Connect(cacheString);

    });

    public static ConnectionMultiplexer Connection
    {
        get
        {
            return lazyConnection.Value;
        }
    }
  
TODO I am still figuring the best way to do this locally. I have it solved when hosting in Azure. I don't like the password being in the code or config file.

Replace `<your cache name>` with the name of your cache, and replace `<primary or secondary key of your cache>` with the key from your cache. To retrieve these values, follow these instructions: https://azure.microsoft.com/documentation/articles/cache-configure/#access-keys

In this sample, team statistics can be retrieved from the database or from the cache. Team statistics are stored in the cache as a serialized `List<Team>`, and also as a sorted set using Redis data types. When retrieving items from a sorted set, you can retrieve some, all, or query for certain items. In this sample we'll query the sorted set for the top 5 teams ranked by number of wins.

### Update the TeamsController class to return results from the cache or the database

Add the following using statements to the `TeamsController.cs` file at the top with the other using statements.

	using System.Diagnostics;
	using Newtonsoft.Json;

Replace the current `public ActionResult Index()` method with the following implementation.

	// GET: Teams
	public ActionResult Index(string actionType, string resultType)
	{
	    List<Team> teams = null;
	
	    switch(actionType)
	    {
	        case "playGames": // Play a new season of games.
	            PlayGames();
	            break;
	
	        case "clearCache": // Clear the results from the cache.
	            ClearCachedTeams();
	            break;
	
	        case "rebuildDB": // Reseed the database with sample data.
	            RebuildDB();
	            break;
	    }
	
	    // Measure the time it takes to retrieve the results.
	    Stopwatch sw = Stopwatch.StartNew();
	
	    switch(resultType)
	    {
	        case "teamsSortedSet": // Retrieve teams from sorted set.
	            teams = GetFromSortedSet();
	            break;
	
	        case "teamsSortedSetTop5": // Retrieve the top 5 teams from the sorted set.
	            teams = GetFromSortedSetTop5();
	            break;
	
	        case "teamsList": // Retrieve teams froms erialized List<Team>.
	            teams = GetFromList();
	            break;
	
	        case "fromDB": // Retrieve results from the database.
	        default:
	            teams = GetFromDB();
	            break;
	    }
	
	    sw.Stop();
	    double ms = sw.ElapsedTicks / (Stopwatch.Frequency / (1000.0));
	    ViewBag.msg += " MS: " + ms.ToString();
	
	    return View(teams);
	}

Add the following three methods to the `TeamsController` class to implement the `playGames`, `clearCache`, and `rebuildDB` action types from the switch statement added in the previous code snippet.

    void PlayGames()
    {
        ViewBag.msg += "Updating team statistics. ";
        // Play a "season" of games
        var teams = from t in db.Teams
                    select t;

        Team.PlayGames(teams);

        db.SaveChanges();

        // Clear any cached results
        ClearCachedTeams();
    }

    void RebuildDB()
    {
        ViewBag.msg += "Rebuilding DB. ";
        // Re-iniatialize the database.
        db.Database.Initialize(true);

        PlayGames();
    }

    void ClearCachedTeams()
    {
        IDatabase cache = Connection.GetDatabase();
        cache.KeyDelete("teamsList");
        cache.KeyDelete("teamsSortedSet");
        ViewBag.msg += "Team data removed from cache. ";
    } 

Add the following four methods to the `TeamsController` class to implement the various ways of retrieving the teams data from the cache and the database.

The `GetFromDB` method reads the team statistics from the database.

    List<Team> GetFromDB()
    {
        ViewBag.msg += "Results read from DB. ";
        var results = from t in db.Teams
            orderby t.Wins descending
            select t; 

        return results.ToList<Team>();
    }

The `GetFromList` method reads the team statistics from cache as a serialized `List<Team>`. If there is a cache miss, the team statistics are read from the database, and then stored in the cache. In this sample we're using JSON.NET serialization.

    List<Team> GetFromList()
    {
        List<Team> teams = null;

        IDatabase cache = Connection.GetDatabase();
        if (cache.KeyExists("teamsList"))
        {
            teams = JsonConvert.DeserializeObject<List<Team>>(cache.StringGet("teamsList"));

            ViewBag.msg += "List read from cache. ";
        }
        else
        {
            ViewBag.msg += "Teams list cache miss. ";
            // Get from database and store in cache
            teams = GetFromDB();

            ViewBag.msg += "Storing results to cache. ";
            cache.StringSet("teamsList", JsonConvert.SerializeObject(teams));

        }

        return teams;
    }

The `GetFromSortedSet` method reads the team statistics from a cached sorted set. If there is a cache miss, the teams statistics are read from the database and stored in the cache as a sorted set.

    List<Team> GetFromSortedSet()
    {
        List<Team> teams = null;
        IDatabase cache = Connection.GetDatabase();
        if (cache.KeyExists("teamsSortedSet"))
        {
            ViewBag.msg += "Reading sorted set from cache. ";
            teams = new List<Team>();
            foreach (var t in cache.SortedSetRangeByRankWithScores("teamsSortedSet", order: Order.Descending))
            {
                Team tt = JsonConvert.DeserializeObject<Team>(t.Element);
                teams.Add(tt);
            }
        }
        else
        {
            ViewBag.msg += "Teams sorted set cache miss. ";

            // Read from DB
            teams = GetFromDB();

            ViewBag.msg += "Storing results to cache. ";
            foreach (var t in teams)
            {
                Console.WriteLine("Adding to sorted set: {0} - {1}", t.Name, t.Wins);
                cache.SortedSetAdd("teamsSortedSet", JsonConvert.SerializeObject(t), t.Wins);
            }
        }

        return teams;
    }

The `GetFromSortedSetTop5` method reads the top 5 teams from the cached sorted set. It starts by checking the cache for the existence of the `teamsSortedSet` key. If this key is not present, the `GetFromSortedSet` method is called to read the team statistics and store them in the cache. Next the cached sorted set is queried for the top 5 teams which are returned.

    List<Team> GetFromSortedSetTop5()
    {
        List<Team> teams = null;
        IDatabase cache = Connection.GetDatabase();

        // If the sorted set of teams is not in the cache, load it there first
        if(!cache.KeyExists("teamsSortedSet"))
        {
            GetFromSortedSet();
        }

        ViewBag.msg += "Retrieving top 5 teams from cache. ";
        // Get the top 5 teams from the sorted set
        teams = new List<Team>();
        foreach (var team in cache.SortedSetRangeByRankWithScores("teamsSortedSet", stop: 4, order: Order.Descending))
        {
            teams.Add(JsonConvert.DeserializeObject<Team>(team.Element));
        }

        return teams;
    }

### Update the Create, Edit, and Delete methods to work with the cache

The scaffolding code that was generated as part of this sample includes methods to add, edit, and delete teams. Anytime a team is added, edited, or removed, the data in the cache becomes outdated. In this section we'll modify these three methods to clear the cached teams so that the cache won't be out of sync with the database.

Browse to the ` public ActionResult Create([Bind(Include = "ID,Name,Wins,Losses,Ties")] Team team)` method in the `TeamsController` class. Add a call to the `ClearCachedTeams` method, as shown in the following example.

    // POST: Teams/Create
    // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
    // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public ActionResult Create([Bind(Include = "ID,Name,Wins,Losses,Ties")] Team team)
    {
        if (ModelState.IsValid)
        {
            db.Teams.Add(team);
            db.SaveChanges();
            // When a team is added, the cache is out of date.
            // Clear the cached teams.
            ClearCachedTeams();
            return RedirectToAction("Index");
        }

        return View(team);
    }

Browse to the `public ActionResult Edit([Bind(Include = "ID,Name,Wins,Losses,Ties")] Team team)` method in the `TeamsController` class. Add a call to the `ClearCachedTeams` method, as shown in the following example.

    // POST: Teams/Edit/5
    // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
    // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public ActionResult Edit([Bind(Include = "ID,Name,Wins,Losses,Ties")] Team team)
    {
        if (ModelState.IsValid)
        {
            db.Entry(team).State = EntityState.Modified;
            db.SaveChanges();
            // When a team is edited, the cache is out of date.
            // Clear the cached teams.
            ClearCachedTeams();
            return RedirectToAction("Index");
        }
        return View(team);
	}

Browse to the `public ActionResult DeleteConfirmed(int id)` method in the `TeamsController` class. Add a call to the `ClearCachedTeams` method, as shown in the following example.

    // POST: Teams/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public ActionResult DeleteConfirmed(int id)
    {
        Team team = db.Teams.Find(id);
        db.Teams.Remove(team);
        db.SaveChanges();
        // When a team is deleted, the cache is out of date.
        // Clear the cached teams.
        ClearCachedTeams();
        return RedirectToAction("Index");
    }

### Update the Teams Index view to work

In **Solution Explorer**, expand the **Views** folder, then the **Teams** folder, and double-click **Index.cshtml**.

Near the top of the file, look for the following paragraph element.

	<p>
	    @Html.ActionLink("Create New", "Create")
	</p>

This is the link to create a new team. Replace the `paragraph` element with the following table. This table has action links for creating a new team, playing a new season of games, clearing the cache, retrieving the teams from the cache in several formats, retrieving the teams from the database, and reloading the database with fresh sample data.

	<table class="table">
	    <tr>
	        <td>
	            @Html.ActionLink("Create New", "Create")
	        </td>
	        <td>
	            @Html.ActionLink("Play Season", "Index", new { actionType = "playGames" })
	        </td>
	        <td>
	            @Html.ActionLink("Clear Cache", "Index", new { actionType = "clearCache" })
	        </td>
	        <td>
	            @Html.ActionLink("List from Cache", "Index", new { resultType = "teamsList" })
	        </td>
	        <td>
	            @Html.ActionLink("Sorted Set from Cache", "Index", new { resultType = "teamsSortedSet" })
	        </td>
	        <td>
	            @Html.ActionLink("Top 5 Teams from Cache", "Index", new { resultType = "teamsSortedSetTop5" })
	        </td>
	        <td>
	            @Html.ActionLink("Load from DB", "Index", new { resultType = "fromDB" })
	        </td>
	        <td>
	            @Html.ActionLink("Rebuild DB", "Index", new { actionType = "rebuildDB" })
	        </td>
	    </tr>    
	</table>

Scroll to the bottom of the **Index.cshtml** file and add the following `tr` element so that it is the last row in the last table in the file.

	<tr><td colspan="5">@ViewBag.Msg</td></tr>

Press **Ctrl+F5** to run the application.

![Cache added][cache-added-to-application]

The following table describes each action link from the sample application.

| Action                  | Description                                                                                                                                                      |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Create New              | Create a new Team.                                                                                                                                               |
| Play Season             | Play a season of games, update the team stats, and clear the teams data from the cache.                                                                          |
| Clear Cache             | Clear the team stats from the cache.                                                                                                                             |
| List from Cache         | Retrieve the team stats from the cache. If there is a cache miss, load the stats from the database and save to the cache.                                        |
| Sorted Set from Cache   | Retrieve the team stats from the cache using a sorted set. If there is a cache miss, load the stats from the database and save to the cache using a sorted set.  |
| Top 5 Teams from Cache  | Retrieve the top 5 teams from the cache using a sorted set. If there is a cache miss, load the stats from the database and save to the cache using a sorted set. |
| Load from DB            | Retrieve the team stats from the database.                                                                                                                       |
| Rebuild DB              | Rebuild the database and reload it with sample team data.                                                                                                        |
| Edit / Details / Delete | Edit a team, view details for a team, delete a team.                                                                                                             |

Click some of the actions and experiment with retrieving the data from the different sources.

Note that retrieving results from the cache is slower than retrieving them from the database. This is because the database is running locally on your machine, but the cache is hosted in Azure. If you want to run the cache locally, you can download and run the [MSOpenTech port of Redis](https://github.com/MSOpenTech/Redis) and change your cache connection string to point to your locally running instance of redis-server.exe, e.g. `return ConnectionMultiplexer.Connect("127.0.0.1");`. For more information, see [Is there a local emulator for Azure Redis Cache?](cache-faq.md#cache-emulator)

In the next section we'll publish the Web App to Azure and run it in the cloud.


<!-- IMAGES -->
[cache-starter-application]: ./media/cache-web-app-howto/cache-starter-application.png
[cache-added-to-application]: ./media/cache-web-app-howto/cache-added-to-application.png
[cache-create-project]: ./media/cache-web-app-howto/cache-create-project.png
[cache-select-template]: ./media/cache-web-app-howto/cache-select-template.png
[cache-model-add-class]: ./media/cache-web-app-howto/cache-model-add-class.png
[cache-model-add-class-dialog]: ./media/cache-web-app-howto/cache-model-add-class-dialog.png
[cache-add-controller]: ./media/cache-web-app-howto/cache-add-controller.png
[cache-add-controller-class]: ./media/cache-web-app-howto/cache-add-controller-class.png
[cache-configure-controller]: ./media/cache-web-app-howto/cache-configure-controller.png
[cache-global-asax]: ./media/cache-web-app-howto/cache-global-asax.png
[cache-RouteConfig-cs]: ./media/cache-web-app-howto/cache-RouteConfig-cs.png
[cache-layout-cshtml]: ./media/cache-web-app-howto/cache-layout-cshtml.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
[]: ./media/cache-web-app-howto/.png
