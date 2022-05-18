---
author: DaybreakQuip
ms.service: azure-communication-services
ms.topic: include
ms.date: 12/09/2021
ms.author: zehangzheng
---
[!INCLUDE [Emergency Calling Notice](../../../includes/emergency-calling-notice-include.md)]

## Prerequisites

- A working [Communication Services calling Android app](../pstn-call.md).

## Important considerations
- The capability to dial 911 and receive a call-back may be a requirement for your application. Verify the E911 requirements with your legal counsel. 
- Microsoft uses country codes according to ISO 3166-1 alpha-2 standard 
- If the country ISO code is not provided to the SDK, the IP address will be used to determine the country of the caller. 
- In case IP address cannot provide reliable geolocation, for example the user is on a Virtual Private Network, it is required to set the ISO Code of the calling country using the API in the Azure Communication Services Calling SDK. 
- If users are dialing from a US territory (for example Guam, US Virgin Islands, Northern Marianas, or American Samoa), it is required to set the ISO code to the US   
- Supported ISO codes are US and Puerto Rico only
- Azure Communication Services direct routing is currently in public preview and not intended for production workloads. So E911 dialing is out of scope for Azure Communication Services direct routing.
- The 911 service is temporarily free to use for Azure Communication Services customers within reasonable use, however billing for the service will be enabled in 2022.   
- Calls to 911 are capped at 10 concurrent calls per Azure Resource.     


## Setting up
Replace the code in **app/src/main/res/layout/activity_main.xml** with following snippet. It will add a new button for testing emergency calls.

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <EditText
        android:id="@+id/callee_id"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:ems="10"
        android:hint="Callee Id"
        android:inputType="textPersonName"
        android:layout_marginTop="100dp"
        android:layout_marginHorizontal="20dp"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="46dp"
        android:gravity="center"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent">

        <Button
            android:id="@+id/call_button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Call" />

        <Button
            android:id="@+id/emergency_button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="933 Test Call" />
    </LinearLayout>
</androidx.constraintlayout.widget.ConstraintLayout>
```
## Emergency test call to phone 
Specify the ISO code of the country where the caller is located. If the ISO code is not provided, the IP address will be used to determine the callers location.  Microsoft uses the ISO 3166-1 alpha-2 standard for country ISO codes, supported ISO codes are listed on the concept page for emergency calling.  

In your **MainActivity.java**, add the following code to your `onCreate` method to retrieve the emergency button you've created in `activity_main.xml`.

```java
Button emergencyButton = findViewById(R.id.emergency_button);
emergencyButton.setOnClickListener(l->emergencyCall());
```

Modify your `createAgent` to specify the emergency country:

```java
private void createAgent() {
    String userToken = "<User_Access_Token>";

    try {
        CommunicationTokenCredential credential = new CommunicationTokenCredential(userToken);
        EmergencyCallOptions emergencyOptions = new EmergencyCallOptions().setCountryCode("<COUNTRY CODE>");
        CallAgentOptions agentOptions = new CallAgentOptions();
        callAgent = new CallClient().createCallAgent(getApplicationContext(), credential, agentOptions).get();
    } catch (Exception ex) {
        Toast.makeText(getApplicationContext(), "Failed to create call agent.", Toast.LENGTH_SHORT).show();
    }
}

```
> [!WARNING]
> Note Azure Communication Services supports enhanced emergency calling to 911 from the United States and Puerto Rico only, calling 911 from other countries is not supported.

## Start a call to 933 test call service

Add the following code to your **MainActivity.java** to add functionality to your emergency call button. For US only, a temporary Caller Id will be assigned for your emergency call despite of whether alternateCallerId param is provided or not. 

```java
private void emergencyCall() {
    String calleePhone = "933";
    StartCallOptions options = new StartCallOptions();
    ArrayList<CommunicationIdentifier> participants = new ArrayList<>();
    participants.add(new PhoneNumberIdentifier(calleePhone));
    call = agent.startCall(
            getApplicationContext(),
            participants,
            options);
}
```
> [!IMPORTANT]
> 933 is a test emergency call service, used to test emergency calling services without interrupting live production emergency calling handling 911 services.  911 must be dialled in actual emergency situations.

## Launch the app

:::image type="content" source="../media/emergency-calling/emergency-calling-android-app.png" alt-text="Screenshot of the completed Android application.":::

The app can now be launched using the "Run App" button on the toolbar (Shift+F10). You can place a call to 933 by clicking the **933 Test Call** button.