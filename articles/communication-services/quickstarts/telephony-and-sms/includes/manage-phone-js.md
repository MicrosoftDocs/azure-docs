## Listing Your Owned Phone Numbers

To list all the phone numbers owned by your Azure Communications Services resource, use the code snippet below:

```javascript

var admin = require('@azure/communication-administration');

let phoneManagement = new admin.PhoneNumberManagementClient(INSERT CONNECTION STRING);

phoneManagement.phone().getAcquiredTelephoneNumbers(INSERT LOCALE).then(numbers => {
    //numbers is an array containing all the phone numbers owned with the following structure:
    // telephoneNumber: string;
    // numberType: string;
    // civicAddressId: string;
    // acquiredCapabilities: string[];
    // availableCapabilities: string[];
    // blockId: string;
    // rangeId: string;
    // assignmentStatus: string;
    // placeName: string;
    // activationState: string;
});

```

1. Using the `Administration SDK`, we instantiate a `PhoneNumberManagementClient` using the resources Connection String.
2. We then use the client to access the `Phone Manager`.
3. We use the getAcquiredTelephoneNUmbers method of the manager to get the numbers owned by the resource. Here, you need to pass a valid locale value which will determine the locale in which the phone information is returned. (ex. "en-us")

<!--TODO: Assignment -->
