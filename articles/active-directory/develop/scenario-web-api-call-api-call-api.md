---
title: Web API that calls web APIs
description: Learn how to build a web API that calls web APIs.
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/26/2020
ms.author: cwerner
ms.reviewer: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a web API that calls web APIs by using the Microsoft identity platform.
---

# A web API that calls web APIs: Call an API

After you have a token, you can call a protected web API. You usually call the downstream APIs from the controller or pages of your web API.

## Controller code

# [ASP.NET Core](#tab/aspnetcore)

When you use *Microsoft.Identity.Web*, you have three usage scenarios:

- [Option 1: Call Microsoft Graph with the SDK](#option-1-call-microsoft-graph-with-the-sdk)
- [Option 2: Call a downstream web API with the helper class](#option-2-call-a-downstream-web-api-with-the-helper-class)
- [Option 3: Call a downstream web API without the helper class](#option-3-call-a-downstream-web-api-without-the-helper-class)

#### Option 1: Call Microsoft Graph with the SDK

In this scenario, you've added the **Microsoft.Identity.Web.GraphServiceClient** NuGet package and added `.AddMicrosoftGraph()` in *Startup.cs* as specified in [Code configuration](scenario-web-api-call-api-app-configuration.md#option-1-call-microsoft-graph), and you can directly inject the `GraphServiceClient` in your controller or page constructor for use in the actions. The following example Razor page displays the photo of the signed-in user.

```csharp
 [Authorize]
 [AuthorizeForScopes(Scopes = new[] { "user.read" })]
 public class IndexModel : PageModel
 {
     private readonly GraphServiceClient _graphServiceClient;

     public IndexModel(GraphServiceClient graphServiceClient)
     {
         _graphServiceClient = graphServiceClient;
     }

     public async Task OnGet()
     {
         var user = await _graphServiceClient.Me.GetAsync();
         try
         {
             using (var photoStream = await _graphServiceClient.Me.Photo.Content.GetAsync())
             {
                 byte[] photoByte = ((MemoryStream)photoStream).ToArray();
                 ViewData["photo"] = Convert.ToBase64String(photoByte);
             }
             ViewData["name"] = user.DisplayName;
         }
         catch (Exception)
         {
             ViewData["photo"] = null;
         }
     }
 }
```

#### Option 2: Call a downstream web API with the helper class

In this scenario, you've added `.AddDownstreamApi()` in *Startup.cs* as specified in [Code configuration](scenario-web-api-call-api-app-configuration.md#option-2-call-a-downstream-web-api-other-than-microsoft-graph), and you can directly inject an `IDownstreamWebApi` service in your controller or page constructor and use it in the actions:

```csharp
 [Authorize]
 [AuthorizeForScopes(ScopeKeySection = "TodoList:Scopes")]
 public class TodoListController : Controller
 {
     private IDownstreamWebApi _downstreamWebApi;
     private const string ServiceName = "TodoList";

     public TodoListController(IDownstreamWebApi downstreamWebApi)
     {
         _downstreamWebApi = downstreamWebApi;
     }

     public async Task<ActionResult> Details(int id)
     {
         var value = await _downstreamWebApi.CallApiForUserAsync(
             ServiceName,
             options =>
             {
                 options.RelativePath = $"me";
             });
         return View(value);
     }
```

The `CallApiForUserAsync` method also has strongly typed generic overrides that enable you to directly receive an object. For example, the following method received a `Todo` instance, which is a strongly typed representation of the JSON returned by the web API.

```csharp
 // GET: TodoList/Details/5
 public async Task<ActionResult> Details(int id)
 {
     var value = await _downstreamWebApi.CallApiForUserAsync<object, Todo>(
         ServiceName,
         null,
         options =>
         {
             options.HttpMethod = HttpMethod.Get;
             options.RelativePath = $"api/todolist/{id}";
         });
     return View(value);
 }
```

#### Option 3: Call a downstream web API without the helper class

If you've decided to get an authorization header using the `IAuthorizationHeaderProvider` interface, the following code continues the example code shown in [A web API that calls web APIs: Acquire a token for the app](scenario-web-api-call-api-acquire-token.md). The code is called in the actions of the API controllers. It calls a downstream API named *todolist*.

 After you've acquired the token, use it as a bearer token to call the downstream API.

```csharp
private async Task CallTodoListService(string accessToken)
{
  // After the token has been returned by Microsoft.Identity.Web, add it to the HTTP authorization header before making the call to access the todolist service.
  authorizationHeader = await authorizationHeaderProvider.GetAuthorizationHeaderForUserAsync(scopes);
  _httpClient.DefaultRequestHeaders["Authorization"] = authorizationHeader;

  // Call the todolist service.
  HttpResponseMessage response = await _httpClient.GetAsync(TodoListBaseAddress + "/api/todolist");
  // ...
}
```

# [ASP.NET](#tab/aspnet)


When you use *Microsoft.Identity.Web*, you have three usage options for calling an API:

- [Option 1: Call Microsoft Graph with the Microsoft Graph SDK](#option-1-call-microsoft-graph-with-the-sdk-from-owin-app)
- [Option 2: Call a downstream web API with the helper class](#option-2-call-a-downstream-web-api-with-the-helper-class-from-owin-app)
- [Option 3: Call a downstream web API without the helper class](#option-3-call-a-downstream-web-api-without-the-helper-class-from-owin-app)

#### Option 1: Call Microsoft Graph with the SDK from OWIN app

You want to call Microsoft Graph. In this scenario, you've added `AddMicrosoftGraph` in *Startup.cs* as specified in [Code configuration](scenario-web-app-call-api-app-configuration.md#option-1-call-microsoft-graph), and you can get the `GraphServiceClient` in your controller or page constructor for use in the actions by using the `GetGraphServiceClient()` extension method on the controller. The following example displays the photo of the signed-in user.

```csharp
[Authorize]
public class HomeController : Controller
{

 public async Task GetIndex()
 {
  var graphServiceClient = this.GetGraphServiceClient();
  var user = await graphServiceClient.Me.GetAsync();
  try
  {
   using (var photoStream = await graphServiceClient.Me.Photo.Content.GetAsync())
   {
    byte[] photoByte = ((MemoryStream)photoStream).ToArray();
    ViewData["photo"] = Convert.ToBase64String(photoByte);
   }
   ViewData["name"] = user.DisplayName;
  }
  catch (Exception)
  {
   ViewData["photo"] = null;
  }
 }
}
```

#### Option 2: Call a downstream web API with the helper class from OWIN app

You want to call a web API other than Microsoft Graph. In that case, you've added `AddDownstreamApi` in *Startup.cs* as specified in [Code configuration](scenario-web-app-call-api-app-configuration.md#option-2-call-a-downstream-web-api-other-than-microsoft-graph), and you can get `IDownstreamApi` service in your controller by calling the `GetDownstreamApi` extension method on the controller:

```csharp
[Authorize]
public class TodoListController : Controller
{ 
  public async Task<ActionResult> Details(int id)
  {
    var downstreamApi = this.GetDownstreamApi();
    var value = await downstreamApi.CallApiForUserAsync(
      ServiceName,
      options =>
      {
        options.RelativePath = $"me";
      });
      return View(value);
  }
}
```

The `CallApiForUserAsync` also has strongly typed generic overrides that enable you to directly receive an object. For example, the following method receives a `Todo` instance, which is a strongly typed representation of the JSON returned by the web API.

```csharp
    // GET: TodoList/Details/5
    public async Task<ActionResult> Details(int id)
    {
        var downstreamApi = this.GetDownstreamApi();
        var value = await downstreamApi.GetForUserAsync<object, Todo>(
            ServiceName,
            null,
            options =>
            {
                options.RelativePath = $"api/todolist/{id}";
            });
        return View(value);
    }
   ```

#### Option 3: Call a downstream web API without the helper class from OWIN app

You've decided to acquire an authorization header using the `IAuthorizationHeaderProvider` service, and you now need to use it in your `HttpClient` or `HttpRequest`. In that case, the following code continues the example code shown in [A web API that calls web APIs: Acquire a token for the app](scenario-web-api-call-api-acquire-token.md). The code is called in the actions of the web API controllers.

```csharp
public async Task<IActionResult> Profile()
{
  // Acquire the access token.
  string[] scopes = new string[]{"user.read"};
  var IAuthorizationHeaderProvider = this.GetAuthorizationHeaderProvider();
  string authorizationHeader = await IAuthorizationHeaderProvider.GetAuthorizationHeaderForUserAsync(scopes);

  // Use the access token to call a protected web API.
  HttpClient httpClient = new HttpClient();
  client.DefaultRequestHeaders.Add("Authorization", authorizationHeader);

  var response = await httpClient.GetAsync($"{webOptions.GraphApiUrl}/beta/me");

  if (response.StatusCode == HttpStatusCode.OK)
  {
    var content = await response.Content.ReadAsStringAsync();

    dynamic me = JsonConvert.DeserializeObject(content);
    ViewData["Me"] = me;
  }

  return View();
}
```

# [Java](#tab/java)

The following code continues the example code that's shown in [A web API that calls web APIs: Acquire a token for the app](scenario-web-api-call-api-acquire-token.md). The code is called in the actions of the API controllers. It calls the downstream API MS Graph.

After you've acquired the token, use it as a bearer token to call the downstream API.

```java
private String callMicrosoftGraphMeEndpoint(String accessToken){
    RestTemplate restTemplate = new RestTemplate();

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    headers.set("Authorization", "Bearer " + accessToken);

    HttpEntity<String> entity = new HttpEntity<>(null, headers);

    String result = restTemplate.exchange("https://graph.microsoft.com/v1.0/me", HttpMethod.GET,
            entity, String.class).getBody();

    return result;
}
```

# [Python](#tab/python)

A sample demonstrating this flow with MSAL Python is available at [ms-identity-python-on-behalf-of](https://github.com/Azure-Samples/ms-identity-python-on-behalf-of).

---

## Next steps

Move on to the next article in this scenario,
[Move to production](scenario-web-api-call-api-production.md).
