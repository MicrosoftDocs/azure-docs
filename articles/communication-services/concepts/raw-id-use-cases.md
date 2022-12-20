---
title: Azure Communication Services - Raw ID use cases
description: Learn more about use cases for choosing Raw ID in SDKs
author: ostoliarova-msft
manager: rajuanitha88
services: azure-communication-services

ms.author: ostoliarova-msft
ms.date: 12/15/2022
ms.topic: conceptual
ms.service: azure-communication-services
#Customer intent: As a developer, I want to learn how to correctly use Raw ID so that I can build applications that run efficiently.
---

# Raw ID use cases in Communication SDKs

This article provides use cases for choosing a Raw ID as a [CommunicationIdentifier type](./identifiers.md#the-communicationidentifier-type) in Azure Communication Services SDKs. Following this guidance will help you understand some use cases when you might want to choose a Raw ID over other types of CommunicationIdentifier.

## Use cases for choosing an identifier

When using Communication Services SDKs and REST APIs, you need to identify the actors who are communicating. Using a *CommunicationIdentifier* is a way for doing this.

CommunicationIdentifier has the following advantages:
- Provides good auto-complete in IDEs.
- Allows using a switch case by type to address different application flows.
- Allows restricting communication to specific types.

In particular, when using Raw ID to instantiate a *CommunicationIdentifier* or retrieving an underlying Raw ID of a *CommunicationIdentifier* of a certain type (e.g. MicrosoftTeamsUserIdentifier, PhoneNumberIdentifier etc.) you can implement even more scenarios:
- Store identifiers in a database and use them as keys.
- Use identifiers as key in dictionaries.
- Implement intuitive REST CRUD APIs by using identifiers as key in REST API paths, instead of having to rely on POST payloads.
- Map Raw IDs to AAD object IDs to enable calling Graph API and provide a rich experience for calling participants.
- Use them as key in declarative UI frameworks such as React to avoid unnecessary re-rendering.

The support of creating *CommunicationIdentifier* from a Raw ID and/or retrieving a Raw ID from a certain type of a *CommunicationIdentifier* removes the need of any custom serialization methods that might use or omit certain object properties. For example, the MicrosoftTeamsUserIdentifier has multiple properties such as IsAnonymous or Cloud, and using methods provided by Identity SDK guarantees that the way of serializing identifiers will stay canonical and consistent even if more properties will be added.

## Storing CommunicationIdentifier in a database
Depending on your scenario, you may want to store CommunicationIdentifier in a database. Each type of a CommunicationIdentifier has an underlying Raw ID, which is either set when instantiating it or incurred from other properties. Identity SDK guarantees that the value is consistent in both options.

Assuming a `ContosoUser` is a class that represents a user of your application and you want to save it along with a corresponding CommunicationIdentifier to the database. The original value for a `CommunicationIdentifier` can come from the Identity, Calling, Chat API or another API but can be represented as a `string` data type in your programming language no matter what the underlying type is:
```csharp
public class ContosoUser
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string CommunicationIdentifier { get; set; }
}
```

By accessing `RawId` property of the `CommunicationIdentifier` you get a string that can be stored in the database:
```csharp
public void StoreToDatabase()
{
    CommunicationIdentifier communicationIdentifier;

    ContosoUser user = new ContosoUser()
    {
        Name = "John",
        Email = "john@doe.com",
        CommunicationIdentifier = communicationIdentifier.RawId
    };
    SaveToDb(user);
}
```

If you want to get `CommunicationIdentifier` from the stored Raw ID, you need to pass the raw string to `FromRawId()` method:
```csharp
public void GetFromDatabase()
{
    ContosoUser user = GetFromDb("john@doe.com");
    CommunicationIdentifier communicationIdentifier = CommunicationIdentifier.FromRawId(user.CommunicationIdentifier);
}
```
It will return CommunicationUserIdentifier, PhoneNumberIdentifier, MicrosoftTeamsUserIdentifier or UnknownIdentifier based on the identifier type.
  
## Storing CommunicationIdentifier in collections
If your scenario requires working with several *CommunicationIdentifier* objects in memory, you may want to store them to a collection (dictionary, list, hashset etc.). As the hashing logic relies on the value of a Raw ID, you can use *CommunicationIdentifier* in collections that require elements to have a reliable hashing behaviour. The next example demonstrates adding *CommunicationIdentifier* objects to different types of collections and checking if they are contained in a collection by instantiating new identifiers from a Raw ID value. This also works for any custom identifiers that are converted to an *UnknownIdentifier* type.
```csharp
public void RawIdGeneratedIdentifiersSupportedAsKeysInCollections()
    {
        var dictionary = new Dictionary<CommunicationIdentifier, string>
        {
            { new CommunicationUserIdentifier("8:acs:bbbcbc1e-9f06-482a-b5d8-20e3f26ef0cd_45ab2481-1c1c-4005-be24-0ffb879b1130"), nameof(CommunicationUserIdentifier)},
            { new MicrosoftTeamsUserIdentifier("45ab2481-1c1c-4005-be24-0ffb879b1130"), nameof(MicrosoftTeamsUserIdentifier) },
        };

        var hashSet = new HashSet<CommunicationIdentifier>
        {
            new PhoneNumberIdentifier("+14255550123"),
            new UnknownIdentifier("28:45ab2481-1c1c-4005-be24-0ffb879b1130")
        };

        var list = new List<CommunicationIdentifier>
        {
            new MicrosoftTeamsUserIdentifier("45ab2481-1c1c-4005-be24-0ffb879b1130"),
            new UnknownIdentifier("28:45ab2481-1c1c-4005-be24-0ffb879b1130")
        };

        Assert.That(dictionary, Does.ContainKey(CommunicationIdentifier.FromRawId("8:acs:bbbcbc1e-9f06-482a-b5d8-20e3f26ef0cd_45ab2481-1c1c-4005-be24-0ffb879b1130")).WithValue(nameof(CommunicationUserIdentifier)));
        CollectionAssert.Contains(hashSet, CommunicationIdentifier.FromRawId("4:+14255550123"));
        CollectionAssert.Contains(list, CommunicationIdentifier.FromRawId("8:orgid:45ab2481-1c1c-4005-be24-0ffb879b1130"));
        CollectionAssert.Contains(list, CommunicationIdentifier.FromRawId("28:45ab2481-1c1c-4005-be24-0ffb879b1130"));
    }
```

## Using Raw ID as key in REST API paths
When designing a REST API, you can have endpoints that have a unique identifier for your application user in a form of a Raw ID string. This way you do not need to pass this value in a POST request body and can have a more intuitive REST CRUD API.
```csharp
public async Task DeserializationExample()
{
    ContosoUser user = GetFromDb("john@doe.com");
    
    using HttpResponseMessage response = await client.GetAsync($"https://contoso.com/v1.0/users/{user.RawId}/profile");
    response.EnsureSuccessStatusCode();
}
```

## Mapping Raw IDs to AAD object IDs.
Consistent underlying Raw ID allows you using *CommunicationIdentifier* when calling Graph API and mapping AAD entities to *CommunicationIdentifier* types.
```csharp
public void DeserializationExample()
{
    ContosoUser user = GetFromDb("john@doe.com");

    string rawId = user.CommunicationIdentifier;
    CommunicationIdentifier teamsUser = CommunicationIdentifier.FromRawId(rawId);
    switch (communicationIdentifier)
    {
        case MicrosoftTeamsUserIdentifier teamsUser:
            string getPhotoUri = $"https://graph.microsoft.com/v1.0/users/{teamsUser.UserId}/photo/$value";
            // ...
            break;
        case CommunicationIdentifier communicationUser:
            // ...
            break;
    }
}
```
Depending on the type of *CommunicationIdentifier* that is stored for a Contoso application in a form of a Raw ID string, it is possible to access specific properties and methods for this type.

## Using Raw IDs as key in UI frameworks
```csharp
```

---

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Correctly identify use cases for choosing a Raw ID
> * Convert between Raw ID and different types of a *CommunicationIdentifier*

To learn more, you may want to explore the following quickstart guides:

* [Understand identifier types](./identifiers.md)
* [Reference documentation](reference.md)
