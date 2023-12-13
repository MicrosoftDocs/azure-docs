---
title: Azure Communication Services - Use cases for string identifiers
description: Learn how to use Raw ID in SDKs
author: ostoliarova-msft
manager: rajuanitha88
services: azure-communication-services

ms.author: ostoliarova
ms.date: 12/23/2022
ms.topic: conceptual
ms.service: azure-communication-services
#Customer intent: As a developer, I want to learn how to correctly use Raw ID so that I can build applications that run efficiently.
---

# Use cases for string identifiers in Communication SDKs

This article provides use cases for choosing a string (Raw ID) as a representation type of the [CommunicationIdentifier type](./identifiers.md#the-communicationidentifier-type) in Azure Communication Services SDKs. Following this guidance will help you understand some use cases when you might want to choose a Raw ID over the CommunicationIdentifier derived types.

## Use cases for choosing an identifier
A common task when implementing communication scenarios is to identify participants of conversations. When you're using Communication Services SDKs, *CommunicationIdentifier* provides the capability of uniquely identifying these participants.

CommunicationIdentifier has the following advantages:
- Provides good auto-complete in IDEs.
- Allows using a switch case by type to address different application flows.
- Allows restricting communication to specific types.
- Allow access to identifier details and use them to call other APIs (such as the Microsoft Graph API) to provide a rich experience for communication participants.

On top of this, the *CommunicationIdentifier* and the derived types (`MicrosoftTeamsUserIdentifier`, `PhoneNumberIdentifier`, etc.) can be converted to its string representation (Raw ID) and restored from the string, making the following scenarios easier to implement:
- Store identifiers in a database and use them as keys.
- Use identifiers as keys in dictionaries.
- Implement intuitive REST CRUD APIs by using identifiers as key in REST API paths, instead of having to rely on POST payloads.
- Use identifiers as keys in declarative UI frameworks such as React to avoid unnecessary re-rendering.

### Creating CommunicationIdentifier and retrieving Raw ID
*CommunicationIdentifier* can be created from a Raw ID and a Raw ID can be retrieved from a type derived from *CommunicationIdentifier*. It removes the need of any custom serialization methods that might take in only certain object properties and omit others. For example, the `MicrosoftTeamsUserIdentifier` has multiple properties such as `IsAnonymous` or `Cloud` or methods to retrieve these values (depending on a platform). Using methods provided by Communication Identity SDK guarantees that the way of serializing identifiers will stay canonical and consistent even if more properties will be added.

Get Raw ID from CommunicationUserIdentifier:

```csharp
public async Task GetRawId()
{
    ChatMessage message = await ChatThreadClient.GetMessageAsync("678f26ef0c");
    CommunicationIdentifier communicationIdentifier = message.Sender;
    String rawId = communicationIdentifier.RawId;
}
```

Instantiate CommunicationUserIdentifier from a Raw ID:

```csharp
public void CommunicationIdentifierFromGetRawId()
{
    String rawId = "8:acs:bbbcbc1e-9f06-482a-b5d8-20e3f26ef0cd_45ab2481-1c1c-4005-be24-0ffb879b1130";
    CommunicationIdentifier communicationIdentifier = CommunicationIdentifier.FromRawId(rawId);
}
```

You can find more platform-specific examples in the following article: [Understand identifier types](./identifiers.md)

## Storing CommunicationIdentifier in a database
One of the typical jobs that may be required from you is mapping Azure Communication Services users to users coming from Contoso user database or identity provider. This is usually achieved by adding an extra column or field in Contoso user DB or Identity Provider. However, given the characteristics of the Raw ID (stable, globally unique, and deterministic), you may as well choose it as a primary key for the user storage.

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
If your scenario requires working with several *CommunicationIdentifier* objects in memory, you may want to store them in a collection (dictionary, list, hash set, etc.). A collection is useful, for example, for maintaining a list of call or chat participants. As the hashing logic relies on the value of a Raw ID, you can use *CommunicationIdentifier* in collections that require elements to have a reliable hashing behavior. The following examples demonstrate adding *CommunicationIdentifier* objects to different types of collections and checking if they're contained in a collection by instantiating new identifiers from a Raw ID value. 

The following example shows how Raw ID can be used as a key in a dictionary to store user's messages:

```csharp
public void StoreMessagesForContosoUsers()
{
    var communicationUser = new CommunicationUserIdentifier("8:acs:bbbcbc1e-9f06-482a-b5d8-20e3f26ef0cd_45ab2481-1c1c-4005-be24-0ffb879b1130");
    var teamsUserUser = new CommunicationUserIdentifier("45ab2481-1c1c-4005-be24-0ffb879b1130");
    
    // A dictionary with a CommunicationIdentifier as key might be used to store messages of a user.
    var userMessages = new Dictionary<string, List<Message>>
    {
        { communicationUser.RawId, new List<Message>() },
        { teamsUserUser.RawId, new List<Message>() },
    };

    // Retrieve messages for a user based on their Raw ID.
    var messages = userMessages[communicationUser.RawId];
}
```

As the hashing logic relies on the value of a Raw ID, you can use `CommunicationIdentifier` itself as a key in a dictionary directly:

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

Hashing logic that relies on the value of a Raw ID, also allows you to add `CommunicationIdentifier` objects to hash sets:
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

Another use case is using Raw IDs in mobile applications to identify participants. You can inject the participant view data for remote participant if you want to handle this information locally in the UI library without sending it to Azure Communication Services.
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

## Using Raw ID as key in REST API paths
When designing a REST API, you can have endpoints that either accept a `CommunicationIdentifier` or a Raw ID string. If the identifier consists of several parts (like ObjectID, cloud name, etc. if you're using `MicrosoftTeamsUserIdentifier`), you might need to pass it in the request body. However, using Raw ID allows you to address the entity in the URL path instead of passing the whole composite object as a JSON in the body. So that you can have a more intuitive REST CRUD API.

```csharp
public async Task UseIdentifierInPath()
{
    CommunicationIdentifier user = GetFromDb("john@doe.com");
    
    using HttpResponseMessage response = await client.GetAsync($"https://contoso.com/v1.0/users/{user.RawId}/profile");
    response.EnsureSuccessStatusCode();
}
```

## Extracting identifier details from Raw IDs.
Consistent underlying Raw ID allows:
- Deserializing to the right identifier type (based on which you can adjust the flow of your app).
- Extracting details of identifiers (such as an oid for `MicrosoftTeamsUserIdentifier`).

The example shows both benefits:
- The type allows you to decide where to take the avatar from.
- The decomposed details allow you to query the API in the right way.

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
It's possible to use Raw ID of an identifier as a key in UI components to track a certain user and avoid unnecessary re-rendering and API calls. In the example, we're changing the order of how users are rendered in a list. In real world, we might want to show new users first or re-order users based on some condition (for example, hand raised). For the sake of simplicity, the following example just reverses the order in which the users are rendered.

```javascript
import { getIdentifierRawId } from '@azure/communication-common';

function CommunicationParticipants() {
  const [users, setUsers] = React.useState([{ id: getIdentifierRawId(userA), name: "John" }, { id: getIdentifierRawId(userB), name: "Jane" }]);
  return (
    <div>
      {users.map((user) => (
      // React uses keys as hints while rendering elements. Each list item should have a key that's unique among its siblings. 
      // Raw ID can be utilized as a such key.
        <ListUser item={user} key={user.id} />
      ))}
      <button onClick={() => setUsers(users.slice().reverse())}>Reverse</button>
    </div>
  );
}

const ListUser = React.memo(function ListUser({ user }) {
  console.log(`Render ${user.name}`);
  return <div>{user.name}</div>;
});
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
