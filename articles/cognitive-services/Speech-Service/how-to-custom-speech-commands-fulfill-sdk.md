

## How To: Fulfill Commands on the client with the Speech SDK

In this How to you will create a and send a custom JSON payload from the Speech Commands application and handle it directly in thje Speech SDK client.

Extend the Speech Commands application we created for turn {OnOff} the {SubjectDevice}

Extend the Speech SDK client sample

First define the Completion Rule and the payload

Go to Completion Rules
Add new completion rule
Condition - Required OnOff, Required SubjectDevice
Action Send Activity action
Content
```json
{
    "name": "SetDeviceState",
    "state": "{OnOff}",
    "device": "{SubjectDevice}"
}
```

Client handling

Add activity handler

check type == 'event' name == "SetDeviceState"

new method on mainpage.xaml.cs

```C#
void SetDeviceState(string deviceName, string state)
{

}
```