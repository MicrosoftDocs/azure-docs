---
title: Azure Communication Services - Raw ID use cases
description: Learn how to use Raw ID in SDKs
author: ostoliarova-msft
manager: rajuanitha88
services: azure-communication-services

ms.author: ostoliarova
ms.date: 12/23/2022
ms.topic: conceptual
ms.service: azure-communication-services
#Customer intent: As a developer, I want to learn how to correctly use Raw ID so that I can build applications that run efficiently.
zone_pivot_groups: acs-js-csharp-python-java
---

# Raw ID use cases in Communication SDKs

This article provides use cases for choosing a string (Raw ID) as a representation type of the [CommunicationIdentifier type](./identifiers.md#the-communicationidentifier-type) in Azure Communication Services SDKs. Following this guidance will help you understand some use cases when you might want to choose a Raw ID over the CommunicationIdentifier derived types.

## Use cases for choosing an identifier
A common task when implementing communication scenarios is to identify participants of conversations. When using Communication Services SDKs, *CommunicationIdentifier* provides the capability of uniquely identifying users.

CommunicationIdentifier has the following advantages:
- Provides good auto-complete in IDEs.
- Allows using a switch case by type to address different application flows.
- Allows restricting communication to specific types.

On top of that, the ability to instantiate a *CommunicationIdentifier* from Raw ID and being able to retrieve an underlying Raw ID of a *CommunicationIdentifier* of a certain type (for example, `MicrosoftTeamsUserIdentifier`, `PhoneNumberIdentifier`, etc.) makes the following scenarios easier to implement:
- Extract identifier details from Raw IDs and use them to call other APIs (such as the Microsoft Graph API) to provide a rich experience for communication participants.
- Store identifiers in a database and use them as keys.
- Use identifiers as keys in dictionaries.
- Implement intuitive REST CRUD APIs by using identifiers as key in REST API paths, instead of having to rely on POST payloads.
- Use identifiers as a keys in declarative UI frameworks such as React to avoid unnecessary re-rendering.

::: zone pivot="programming-language-javascript"
[!INCLUDE [Raw ID in the JavaScript SDK](./includes/raw-ids/raw-ids-js.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [Raw ID in the .NET SDK](./includes/raw-ids/raw-ids-net.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Raw ID in the Python SDK](./includes/raw-ids/raw-ids-python.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Raw ID in the Java SDK](./includes/raw-ids/raw-ids-java.md)]
::: zone-end

## Storing CommunicationIdentifier in a database
Depending on your scenario, you may want to store CommunicationIdentifier in a database. Each type of CommunicationIdentifier has an underlying Raw ID, which is stable, globally unique, and deterministic. The guaranteed uniqueness allows choosing it as a key in the storage. You can map ACS users' IDs to the users coming from the Contoso identity provider. 

Assuming a `ContosoUser` is a class that represents a user of your application, and you want to save it along with a corresponding CommunicationIdentifier to the database. The original value for a `CommunicationIdentifier` can come from the Communication Identity, Calling or Chat APIs or from a custom Contoso API but can be represented as a `string` data type in your programming language no matter what the underlying type is:
```csharp
public class ContosoUser
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string CommunicationId { get; set; }
}
```

You can access `RawId` property of the `CommunicationId` to get a string that can be stored in the database:
```csharp
public void StoreToDatabase()
{
    CommunicationIdentifier communicationIdentifier;

    ContosoUser user = new ContosoUser()
    {
        Name = "John",
        Email = "john@doe.com",
        CommunicationId = communicationIdentifier.RawId
    };
    SaveToDb(user);
}
```

If you want to get `CommunicationIdentifier` from the stored Raw ID, you need to pass the raw string to `FromRawId()` method:
```csharp
public void GetFromDatabase()
{
    ContosoUser user = GetFromDb("john@doe.com");
    CommunicationIdentifier communicationIdentifier = CommunicationIdentifier.FromRawId(user.CommunicationId);
}
```
It will return `CommunicationUserIdentifier`, `PhoneNumberIdentifier`, `MicrosoftTeamsUserIdentifier` or `UnknownIdentifier` based on the identifier type.
  
## Storing CommunicationIdentifier in collections
If your scenario requires working with several *CommunicationIdentifier* objects in memory, you may want to store them in a collection (dictionary, list, hash set, etc.). This is useful, for example, for maintaining a list of call or chat participants. As the hashing logic relies on the value of a Raw ID, you can use *CommunicationIdentifier* in collections that require elements to have a reliable hashing behavior. The following examples demonstrate adding *CommunicationIdentifier* objects to different types of collections and checking if they're contained in a collection by instantiating new identifiers from a Raw ID value. The same approach also works for identifiers that are converted to an *UnknownIdentifier* type, which is reserved for any new types of identifiers that might be introduced in the future, to maintain the compatibility in older SDK versions.
```csharp
public void StoreMessagesForContosoUsers()
    {
        // A dictionary with a CommunicationIdentifier as key might be used to store messages of a user.
        var userMessages = new Dictionary<CommunicationIdentifier, List<Message>>
        {
            { new CommunicationUserIdentifier("8:acs:bbbcbc1e-9f06-482a-b5d8-20e3f26ef0cd_45ab2481-1c1c-4005-be24-0ffb879b1130"), new List<Message>() },
            { new MicrosoftTeamsUserIdentifier("45ab2481-1c1c-4005-be24-0ffb879b1130"), new List<Message>() },
        };

        // Retrieve messages for a user based on their Raw ID.
        var messages = userMessages[CommunicationIdentifier.FromRawId("8:acs:bbbcbc1e-9f06-482a-b5d8-20e3f26ef0cd_45ab2481-1c1c-4005-be24-0ffb879b1130")];
    }
```

```csharp
public void StoreUniqueContosoUsers()
    {
        // A hash set of unique users of a Contoso application.
        var users = new HashSet<CommunicationIdentifier>
        {
            new PhoneNumberIdentifier("+14255550123"),
            new UnknownIdentifier("28:45ab2481-1c1c-4005-be24-0ffb879b1130")
        };

        // Implement custom flow for a new communication user.
         if (users.Contains(CommunicationIdentifier.FromRawId("4:+14255550123"))){
            //...
         }
    }
```

```csharp
public void StoreContosoUsersInOrderTheyJoin()
    {
        // A list set of users that can be used in aggregate functions or statistics calculation.
        var participants = new List<CommunicationIdentifier>
        {
            new MicrosoftTeamsUserIdentifier("45ab2481-1c1c-4005-be24-0ffb879b1130"),
            new UnknownIdentifier("28:45ab2481-1c1c-4005-be24-0ffb879b1130")
        };

        // Add a new participant when having a Raw ID.
        participants.Add(CommunicationIdentifier.FromRawId("8:orgid:45ab2481-1c1c-4005-be24-0ffb879b1130"));
    }
```

## Using Raw ID as key in REST API paths
When designing a REST API, you can have endpoints that have a unique identifier for your application user in a form of a Raw ID string. If the identifier consists of several parts (like ObjectID, cloud name, etc. in the case of the `MicrosoftTeamsUserIdentifier`), using Raw ID allows to address the entity in the URL path instead of passing the whole composite object as a JSON in the body. So that you can have a more intuitive REST CRUD API.

```csharp
public async Task UseIdentifierInPath()
{
    ContosoUser user = GetFromDb("john@doe.com");
    
    using HttpResponseMessage response = await client.GetAsync($"https://contoso.com/v1.0/users/{user.CommunicationId}/profile");
    response.EnsureSuccessStatusCode();
}
```

## Extracting identifier details from Raw IDs.
Consistent underlying Raw ID allows:
- Deserializing to the right identifier type (based on which you can adjust the flow of your app).
- Extracting details of identifiers (such as an oid for `msteamsuser`).

The example below shows both benefits:
- The type allows you to decide where to take the avatar from.
- The decomposed details allow you to query the api in the right way.

```csharp
public void ExtractIdentifierDetails()
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
            string getPhotoUri = GetAvatarFromDB(communicationUser.Id);
            // ...
            break;
    }
}
```

You can access properties or methods for a specific *CommunicationIdentifier* type that is stored in a Contoso database in a form of a string (Raw ID).

## Using Raw IDs as key in UI frameworks
It's possible to use Raw ID of an identifier as a key in UI components to track a certain user and avoid unnecessary re-rendering and API calls.
```react
import { getIdentifierRawId } from '@azure/communication-common';

const user = await addUserToThread(
    token,
    botId
);

setContainerProps({
    ...newPrerequisites,
    userId: getIdentifierRawId(user),
    avatar: args.avatar
});

// No need to call an API again when rendering components as Raw ID provides a reliable way to track entities.
render() {
    return (
      <div>
        <p>(ContosoUsers.GetName({this.props.userId})) joined the thread</p>
      </div>
    );
}
```

## Using Raw IDs in mobile applications to identify participants
You can inject the participant view data for remote participant if you want to handle this information locally in the UI library without sending it to Azure Communication Services.
This view data can contain a UIImage that represents the avatar to render, and a display name they can optionally display instead. 
Both the participant CommunicationIdentifier and Raw ID retrieved from it can be used to uniquely identify a remote participant.

```swift
callComposite.events.onRemoteParticipantJoined = { identifiers in
  for identifier in identifiers {
    // map identifier to displayName
    let participantViewData = ParticipantViewData(displayName: "<DISPLAY_NAME>")
    callComposite.set(remoteParticipantViewData: participantViewData,
                      for: identifier) { result in
      switch result {
      case .success:
        print("Set participant view data succeeded")
      case .failure(let error):
        print("Set participant view data failed with \(error)")
      }
    }
  }
}    
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
