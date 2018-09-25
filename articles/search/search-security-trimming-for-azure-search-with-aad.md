---
title: "Security filters for trimming Azure Search results using Active Directory identities | Microsoft Docs"
description: Access control on Azure Search content using security filters and Active Directory identities.
author: "revitalbarletz"
manager: "jlembicz"
services: search
ms.service: search
ms.topic: conceptual
ms.date: 11/07/2017
ms.author: revitalb
---
# Security filters for trimming Azure Search results using Active Directory identities

This article demonstrates how to use Azure Active Directory (AAD) security identities together with filters in Azure Search to trim search results based on user group membership.

This article covers the following tasks:
> [!div class="checklist"]
- Create AAD groups and users
- Associate the user with the group you have created
- Cache the new groups
- Index documents with associated groups
- Issue a search request with group identifiers filter

>[!NOTE]
> Sample code snippets in this article are written in C#. You can find the full source code [on GitHub](http://aka.ms/search-dotnet-howto). 

## Prerequisites

Your index in Azure Search must have a [security field](search-security-trimming-for-azure-search.md) to store the list of group identities having read access to the document. This use case assumes a one-to-one correspondence between a securable item (such as an individual's college application) and a security field specifying who has access to that item (admissions personnel).

You must have AAD administrator permissions, required in this walkthrough for creating users, groups, and associations in AAD.

Your application must also be registered with AAD, as described in the following procedure.

### Register your application with AAD

This step integrates your application with AAD for the purpose of accepting sign-ins of user and group accounts. If you are not an AAD admin in your organization, you might need to [create a new tenant](https://docs.microsoft.com/azure/active-directory/develop/active-directory-howto-tenant) to perform the following steps.

1. Go to the [**Application Registration Portal**](https://apps.dev.microsoft.com) >  **Converged app** > **Add an app**.
2. Enter a name for your application, then click **Create**. 
3. Select your newly registered application in the My Applications page.
4. On the application registration page > **Platforms** > **Add Platform**, choose **Web API**.
5. Still on the application registration page, go to > **Microsoft Graph Permissions** > **Add**.
6. In Select Permissions, add the following delegated permissions and then click **OK**:

   + **Directory.ReadWrite.All**
   + **Group.ReadWrite.All**
   + **User.ReadWrite.All**

Microsoft Graph provides an API that allows programmatic access to AAD through a REST API. The code sample for this walkthrough uses the permissions to call the Microsoft Graph API for creating groups, users, and associations. The APIs are also used to cache group identifiers for faster filtering.

## Create users and groups

If you are adding search to an established application, you might have existing user and group identifiers in AAD. In this case, you can skip the next three steps. 

However, if you don't have existing users, you can use Microsoft Graph APIs to create the security principals. The following code snippets demonstrate how to generate identifiers, which become data values for the security field in your Azure Search index. In our hypothetical college admissions application, this would be the security identifiers for admissions staff.

User and group membership might be very fluid, especially in large organizations. Code that builds user and group identities should run often enough to pick up changes in organization membership. Likewise, your Azure Search index requires a similar update schedule to reflect the current status of permitted users and resources.

### Step 1: Create [AAD Group](https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/group_post_groups) 
```csharp
// Instantiate graph client 
GraphServiceClient graph = new GraphServiceClient(new DelegateAuthenticationProvider(...));
Group group = new Group()
{
    DisplayName = "My First Prog Group",
    SecurityEnabled = true,
    MailEnabled = false,
    MailNickname = "group1"
}; 
Group newGroup = await graph.Groups.Request().AddAsync(group);
```
   
### Step 2: Create [AAD User](https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/user_post_users) 
```csharp
User user = new User()
{
    GivenName = "First User",
    Surname = "User1",
    MailNickname = "User1",
    DisplayName = "First User",
    UserPrincipalName = "User1@FirstUser.com",
    PasswordProfile = new PasswordProfile() { Password = "********" },
    AccountEnabled = true
};
User newUser = await graph.Users.Request().AddAsync(user);
```

### Step 3: Associate user and group
```csharp
await graph.Groups[newGroup.Id].Members.References.Request().AddAsync(newUser);
```

### Step 4: Cache the groups identifiers
Optionally, to reduce network latency, you can cache the user-group associations so that when a search request is issued, groups are returned from the cache, saving a roundtrip to AAD. You can use (AAD Batch API)[https://developer.microsoft.com/graph/docs/concepts/json_batching] to send a single Http request with multiple users and build the cache.

Microsoft Graph is designed to handle a high volume of requests. If an overwhelming number of requests occur, Microsoft Graph fails the request with HTTP status code 429. For more information, see [Microsoft Graph throttling](https://developer.microsoft.com/graph/docs/concepts/throttling).

## Index document with their permitted groups

Query operations in Azure Search are executed over an Azure Search index. In this step, an indexing operation imports searchable data into an index, including the identifiers used as security filters. 

Azure Search does not authenticate user identities, or provide logic for establishing which content a user has permission to view. The use case for security trimming assumes that you provide the association between a sensitive document and the group identifier having access to that document, imported intact into a search index. 

In the hypothetical example, the body of the PUT request on  an Azure Search index would include an applicant's college essay or transcript along with the group identifier having permission to view that content. 

In the generic example used in the code sample for this walkthrough, the index action might look as follows:

```csharp
var actions = new IndexAction<SecuredFiles>[]
              {
                  IndexAction.Upload(
                  new SecuredFiles()
                  {
                      FileId = "1",
                      Name = "secured_file_a",
                      GroupIds = new[] { groups[0] }
                  }),
              ...
             };

var batch = IndexBatch.New(actions);

_indexClient.Documents.Index(batch);  
```

## Issue a search request

For security trimming purposes, the values in your security field in the index are static values used for including or excluding documents in search results. For example, if the group identifier for Admissions is "A11B22C33D44-E55F66G77-H88I99JKK", any documents in an Azure Search index having that identifier in the security filed are included (or excluded) in the search results sent back to the requestor.

To filter documents returned in search results based on groups of the user issuing the request, review the following steps.

### Step 1: Retrieve user's group identifiers

If the user's groups were not already cached, or the cache has expired, issue the [groups](https://developer.microsoft.com/en-us/graph/docs/api-reference/v1.0/api/directoryobject_getmembergroups) request
```csharp
private static void RefreshCacheIfRequired(string user)
{
    if (!_groupsCache.ContainsKey(user))
    {
        var groups = GetGroupIdsForUser(user).Result;
        _groupsCache[user] = groups;
    }
}

private static async Task<List<string>> GetGroupIdsForUser(string userPrincipalName)
{
    List<string> groups = new List<string>();
    var allUserGroupsRequest = graph.Users[userPrincipalName].GetMemberGroups(true).Request();

    while (allUserGroupsRequest != null) 
    {
        IDirectoryObjectGetMemberGroupsRequestBuilder allUserGroups = await allUserGroupsRequest.PostAsync();
        groups = allUserGroups.ToList();
        allUserGroupsRequest = allUserGroups.NextPageRequest;
    }
    return groups;
}
``` 

### Step 2: Compose the search request

Assuming you have the user's groups membership, you can issue the search request with the appropriate filter values.

```csharp
string filter = String.Format("groupIds/any(p:search.in(p, '{0}'))", string.Join(",", groups.Select(g => g.ToString())));
SearchParameters parameters = new SearchParameters()
             {
                 Filter = filter,
                 Select = new[] { "application essays" }
             };

DocumentSearchResult<SecuredFiles> results = _indexClient.Documents.Search<SecuredFiles>("*", parameters);
```
### Step 3: Handle the results

The response includes a filtered list of documents, consisting of those that the user has permission to view. Depending on how you construct the search results page, you might want to include visual cues to reflect the filtered result set.

## Conclusion

In this walkthrough, you learned techniques for using AAD sign-ins to filter documents in Azure Search results, trimming the results of documents that do not match the filter provided on the request.

## See also

+ [Identity-based access control using Azure Search filters](search-security-trimming-for-azure-search.md)
+ [Filters in Azure Search](search-filters.md)
+ [Data security and access control in Azure Search operations](search-security-overview.md)
