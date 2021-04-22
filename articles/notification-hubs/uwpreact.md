---
title: Send Azure Notification Hubs notifications to Android and iOS applications
description: Learn about the cross-platform capabilities of Azure Notification Hubs. 
author: sethmanheim
ms.author: sethm
ms.service: notification-hubs
ms.topic: conceptual
ms.date: 04/22/2021
ms.custom: template-concept
---

# Send notifications to Android and iOS applications

This article provides an overview of the Azure Notification Hub sample application built to demonstrate the capabilities of Azure Notification Hub on multiple platforms. The application uses a land survey scenario, in which the desktop **Contoso Land Survey** application sends notifications, which both Android and iOS Contoso applications can receive.

You can download the complete sample from GitHub.

## Prerequisites

To build the sample, you need the following prerequisites:

- An Azure subscription. If you don't have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Microsoft Visual Studio 2019 or later. This sample uses [Visual Studio 2019](https://www.visualstudio.com/products).
- Visual Studio 2019 with the following workloads installed:
  - .NET 5.0 SDK
  - ASP.NET and web development
  - Azure development
  - Node.js development
  - [UWP app-development tools](/windows/uwp/get-started/get-set-up)
- Firebase account to enable push notifications for Android.
- Apple developer account to enable push notifications for iOS.
- A SQL Server database instance, hosted on Azure.
- An Azure Notification Hub namespace and hub.

## Sample architecture

The solution consists of the following components:

- Azure Notification Hub instance: an ANH namespace and hub configured on the [Azure portal](https://portal.azure.com).
- SQL Server database: A SQL Server database instance, configured on the [Azure portal](https://portal.azure.com).
- ASP.NET app back-end: a web API back-end built on .NET 5.0, which connects with the notification hub, and is hosted as an Azure App Service.
- Windows UWP application: a UWP application built using React Native, and acting as a "manager" application that dispatches news and survey information to various users and survey groups. The application also helps to create new users and to edit groups a user is assigned to.
- Android and iOS client apps: "Land Survey" applications built using React Native. These apps show users the information dispatched by the UWP manager application.

## Sample folder structure

The sample application on GitHub contains the following folders:

- **NotificationHub.Sample.API**: A Visual Studio 2019 ASP.NET web API solution that acts as a back end.
- **app**: A cross-platform React Native application that enables dispatching notifications with a manager login, and to then receive notifications with a survey user login.
- **azure-template**: Azure Resource Manager templates (`parameters.json` and `template.json`) that you can use to deploy all the necessary resources to configure this deployment in your Azure subscription. For more information about Resource Manager template deployment, see [Create and deploy ARM templates using the Azure portal](/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal).

## Sample overview

The following sections provide an overview of the components that comprise the sample.

### Controllers

#### Authentication

The following methods in AuthenticateController.cs authenticatesubs a logged-in user:

```css
[HttpPost]
[Route("login")]
public async Task<IActionResult> Login([FromBody] LoginModel model)
{
   var user = await userManager.FindByNameAsync(model.Username);
    if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
    {
        var userRoles = await userManager.GetRolesAsync(user);

        var authClaims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        foreach (var userRole in userRoles)
        {
            authClaims.Add(new Claim(ClaimTypes.Role, userRole));
        }

        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

        var token = new JwtSecurityToken(
            issuer: _configuration["JWT:ValidIssuer"],
            audience: _configuration["JWT:ValidAudience"],
            expires: DateTime.Now.AddHours(3),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

        UserDetails userDetails = new UserDetails();
        userDetails.FirstName = model.Username;
        userDetails.LastName = model.Username;
        userDetails.UserName = model.Username;

        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            expiration = token.ValidTo,
            username = model.Username,
            email = user.Email,
            role = userRoles != null ? userRoles[0] : "Site-Manager",
            user = userDetails
        });
    }
    return Unauthorized();
}

[HttpPost]
[Route("register")]
public async Task<IActionResult> Register([FromBody] RegisterModel model)
{
    var userExists = await userManager.FindByNameAsync(model.Username);
    if (userExists != null)
        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });

    ApplicationUser user = new ApplicationUser()
    {
        Email = model.Email,
        SecurityStamp = Guid.NewGuid().ToString(),
        UserName = model.Username
    };
    var result = await userManager.CreateAsync(user, model.Password);
    if (!result.Succeeded)
        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });

    if (!await roleManager.RoleExistsAsync(UserRoles.SiteManager))
        await roleManager.CreateAsync(new IdentityRole(UserRoles.SiteManager));

    if (await roleManager.RoleExistsAsync(UserRoles.SiteManager))
    {
        await userManager.AddToRoleAsync(user, UserRoles.SiteManager);
    }

    return Ok(new Response { Status = "Success", Message = "User created successfully!" });
}
```

### Dashboard

The dashboard controller in DashboardController.cs returns all notification information:

```css
public class DashboardController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    private readonly INotificationService _notificationService;

    public DashboardController(ApplicationDbContext dbContext, INotificationService notificationService)
    {
        _db = dbContext;
        _notificationService = notificationService;
    }

    [HttpGet("insights")]
    public async Task<IActionResult> GetDashboardInsight(string duration)
    {
        DashboardInsight dashboardInsight = new DashboardInsight();

        dashboardInsight.DeviceTrends = await _notificationService.GetAllRegistrationInfoAsync();

        var notificationMessages = _db.NotificationMessages.ToList();

        switch (duration)
        {
            case "Daily":
                {
                    dashboardInsight.NotificationTrends = _db.NotificationMessages
                                                            .GroupBy(m => m.SentTime.Date)
                                                            .Select(m => new NotificationTrend()
                                                            {
                                                                Timestamp = m.Key.ToShortDateString(),
                                                                NotificationsSent = m.Count()
                                                            }).ToList();
                }
                break;
            case "Weekly":
                {
                    dashboardInsight.NotificationTrends = notificationMessages
                                                            .GroupBy(m => WeekNumber(m.SentTime.Date))
                                                            .Select(m => new NotificationTrend()
                                                            {
                                                                Timestamp = FirstDateOfWeekISO8601(DateTime.Now.Year, m.Key).ToShortDateString(),
                                                                NotificationsSent = m.Count()
                                                            }).ToList();
                }
                break;
            case "Monthly":
                {
                    dashboardInsight.NotificationTrends = _db.NotificationMessages
                                                            .GroupBy(m => m.SentTime.Date.Month)
                                                            .Select(m => new NotificationTrend()
                                                            {
                                                                Timestamp = m.Key + "-" + DateTime.Now.Year,
                                                                NotificationsSent = m.Count()
                                                            }).ToList();
                }
                break;
            default:
                break;
        }

        dashboardInsight.TotalGroups = _db.SurveyGroups.Count();
        dashboardInsight.TotalUsers = _db.Users.Count();
        dashboardInsight.TotalNotificationsSent = _db.NotificationMessages.Count();

        return Ok(dashboardInsight);
    }
```

### Front end

To call any backend API, the sample creates the notification.service.js service, which makes actual API call. This code is located in app\data\services\notification.service.js:

```nodejs
export const sendNotificationAPI = async (userInfo) => {
  let url = `${api}notification/send`;
  let authHeader = await getAuthHeaders();
  return await post(url, userInfo, { ...authHeader });
};

export const getNotificationsAPI = async () => {
  let url = `${api}notification/get`;
  let authHeader = await getAuthHeaders();
  return await get(url, { ...authHeader });
};
```

### Manager application

This sample has a UWP application built using React Native, which acts as a "manager" application that dispatches news and survey information to various users and survey groups. The application also helps to create new users and edit groups to which a user is assigned.

For the manager login, use the following endpoint and POST body to generate user credentials of your choice. You can use any HTTP REST client of your choice:

#### Endpoint

```http
POST {{endpoint}}api/authenticate/register-admin
```

#### Body

```http
{
  "username": "<USER_NAME>",
  "email": "<EMAIL>",
  "password": "<PASSWORD>"
}
```

Once registered, you should be able to sign in to the UWP application with the same credentials.

### Notification controller

The following code, in NotificationController.cs, gets and sends notifications:

```cs
[Produces("application/json")]
[Consumes("application/json")]
[HttpPost("send")]
public async Task<ActionResult> SendNotification([FromBody] NotificationMessage notificationMessage)
{
    try
    {
        List<string> tags = new List<string>();

        // attach survey group and user information with notificationMessage
        notificationMessage.SurveyGroupTags.ForEach(surveyGroupId =>
        {
            var group = _db.SurveyGroups.Where(g => g.Id == surveyGroupId).FirstOrDefault();
            if (group != null)
            {
                notificationMessage.SurveyGroups.Add(group);
                tags.Add($"group:{group.GroupName.Replace(' ', '-')}");
            }
        });

        notificationMessage.UserTags.ForEach(userId =>
        {
            var user = _db.Users.Where(u => u.Id == userId).FirstOrDefault();
            if (user != null)
            {
                notificationMessage.Users.Add(user);
                tags.Add($"username:{user.UserName}");
            }
        });
        _db.NotificationMessages.Add(notificationMessage);

        // send template notification
        var notification = new Dictionary<string, string>();
        notification.Add("title", notificationMessage.NotificationTitle);
        notification.Add("message", notificationMessage.NotificationDescription);

        var res = await _notificationService.RequestNotificationAsync(notificationMessage, tags, HttpContext.RequestAborted);

        await _db.SaveChangesAsync();
        return Ok(notificationMessage);
    }
    catch (Exception ex)
    {
        return BadRequest(ex.Message);
    }
}

[Produces("application/json")]
[HttpGet("get")]
public async Task<ActionResult> Get()
{
    try
    {
        var surveyGroups = _db.NotificationMessages.Include(message => message.SurveyGroups).Include(message => message.Users).ToList();
        return Ok(surveyGroups);
    }
    catch (Exception ex)
    {
        return BadRequest();
    }
}
```

## Build the solution

To build the sample, follow these steps.

### Create resource: SQL database

Create a SQL Server database instance in the Azure portal. For example:

### Create resource: notification hub

Create a notification hub in the Azure portal as follows:

[!INCLUDE [notification-hubs-portal-create-new-hub](../../includes/notification-hubs-portal-create-new-hub.md)]

### Configure backend

To configure the app backend, locate the **/NotificationHub.Sample.API/appsettings.json** file and configure the SQL Server connection string:

```json
"ConnectionStrings": {
    "SQLServerConnectionString": "Server=tcp:<SERVER_NAME>,1433;Initial Catalog=<DB_NAME>;Persist Security Info=False;User ID=<DB_USER_NAME>;Password=<PASSWORD>;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  },
```

You can run the API solution locally or on any IIS server, or deploy it as an Azure Web App Service. Keep the URL of the API handy.

### Create notification service

The notification service located in **NotificationHub.Sample.API/NotificationHub.Sample.API/Services/Notifications/INotificationService.cs** has methods to create and delete the installation. There is also a method to send notifications to all registered users, and to get all registration information:

```cs
public interface INotificationService
{
   Task<bool> CreateOrUpdateInstallationAsync(DeviceInstallation deviceInstallation, CancellationToken cancellationToken);
   Task<bool> DeleteInstallationByIdAsync(string installationId, CancellationToken cancellationToken);
   Task<bool> RequestNotificationAsync(NotificationMessage notificationMessage, IList<string> tags, CancellationToken cancellationToken);
   Task<List<DeviceTrend>> GetAllRegistrationInfoAsync();
}
```

## Run React native frontend application for Windows

Open the **app** folder in your preferred terminal or shell window. Then, do the following:

1. Run `npm install`.
2. Run `npm run start` from one terminal window.
3. Open a new terminal window in parallel, and run `npx react-native run-windows` to run the UWP application.

## Run React native frontend application for iOS or Android

To run the iOS or Android client application, run the following two commands in two separate terminal windows, inside the **\app** folder. Note that you cannot receive notifications in the iOS simulator:

```shell
$ npm run start

$ npx react-native run-android
or
$ npx react-native run-ios
```

## Next steps

