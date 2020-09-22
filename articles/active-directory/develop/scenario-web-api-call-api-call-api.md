---
title: Web API that calls web APIs - Microsoft identity platform | Azure
description: Learn how to build a web API that calls web APIs.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a web API that calls web APIs by using the Microsoft identity platform for developers.
---

# A web API that calls web APIs: Call an API

After you have a token, you can call a protected web API. You usually call the downstream APIs from the controller or pages of your web API.

## Controller code

# [ASP.NET Core](#tab/aspnetcore)

When you use Microsoft.Identity.Web, you have three cases:

1. you want to call Microsoft.Graph. In that case you have added `AddMicrosoftGraph` in the Startup.cs, and you can directly inject the `GraphServiceClient` in your controller or page constructor, and use it in the actions. Below is an example of a Razor page, which displays the photo of the signed-in user.

   ```CSharp
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
            var user = await _graphServiceClient.Me.Request().GetAsync();
            try
            {
                using (var photoStream = await _graphServiceClient.Me.Photo.Content.Request().GetAsync())
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

1. You want to call another web API than graph. In that case you have added `AddDownstreamWebApi` in the startup.cs and you can directly inject a `IDownstreamWebApi` service in your controller or page constructor and use it in the actions:

   ```CSharp
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
            var value = await _downstreamWebApi.CallWebApiForUserAsync(
                ServiceName,
                options =>
                {
                    options.RelativePath = $"me";
                });
            return View(value);
        }
   ```CSharp

   The `CallWebApiForUserAsync` also has strongly typed generic overrides that enable you to directly receive an object.
   For instance the following method received a `Todo` instance, which is a strongly typed representation of the JSON 
   returned by the web API.

   ```CSharp
    // GET: TodoList/Details/5
    public async Task<ActionResult> Details(int id)
    {
        var value = await _downstreamWebApi.CallWebApiForUserAsync<object, Todo>(
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

1. You've decided to acquire a token yourself using the `ITokenAcquisition` service, and you now need to use it. In that case, the following code continues the example code that's shown in [A web API that calls web APIs: Acquire a token for the app](scenario-web-api-call-api-acquire-token.md). The code is called in the actions of the API controllers. It calls a downstream API named *todolist*.

   After you've acquired the token, use it as a bearer token to call the downstream API.

   ```csharp
   private async Task CallTodoListService(string accessToken)
   {
    // After the token has been returned by Microsoft Identity Web, add it to the HTTP authorization header before making the call to access the To Do list service.
   _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", result.AccessToken);

   // Call the To Do list service.
   HttpResponseMessage response = await _httpClient.GetAsync(TodoListBaseAddress + "/api/todolist");
   // ...
   }
   ```

# [Java](#tab/java)

The following code continues the example code that's shown in [A web API that calls web APIs: Acquire a token for the app](scenario-web-api-call-api-acquire-token.md). The code is called in the actions of the API controllers. It calls the downstream API MS Graph.

After you've acquired the token, use it as a bearer token to call the downstream API.

```Java
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
A sample demonstrating this flow with MSAL Python isn't yet available.

---

## Next steps

> [!div class="nextstepaction"]
> [A web API that calls web APIs: Move to production](scenario-web-api-call-api-production.md)
