---
author: DaybreakQuip
ms.service: azure-communication-services
ms.topic: include
ms.date: 12/09/2021
ms.author: zehangzheng
---
[!INCLUDE [Emergency Calling Notice](../../../includes/emergency-calling-notice-include.md)]

## Prerequisites

- A working [Communication Services calling app for Android](../pstn-call.md)

## Important considerations

- The capability to dial an emergency number and receive a callback might be a requirement for your application. Verify the emergency calling requirements with your legal counsel.
- Microsoft uses country/region codes according to the ISO 3166-1 alpha-2 standard.
- Supported ISO codes are US (United States), PR (Puerto Rico), CA (Canada), and GB (United Kingdom) only.
- If you don't provide the country/region ISO code to the Azure Communication Services Calling SDK, Microsoft uses the IP address to determine the country or region of the caller.

  If the IP address can't provide reliable geolocation (for example, the user is on a virtual private network), you must set the ISO code of the calling country or region by using the API in the Calling SDK.
- If users are dialing from a US territory (for example, Guam, US Virgin Islands, Northern Mariana Islands, or American Samoa), you must set the ISO code to US.
- Azure Communication Services direct routing is currently in public preview and not intended for production workloads. Emergency dialing is out of scope for Azure Communication Services direct routing.
- For information about billing for the emergency service in Azure Communication Services, see the [pricing page](https://azure.microsoft.com/pricing/details/communication-services/).

## Set up a button for testing

Replace the code in *app/src/main/res/layout/activity_main.xml* with the following snippet. It adds a new button for testing emergency calls.

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

## Specify the country or region

Specify the ISO code of the country or region where the caller is located. For a list of supported ISO codes, see the [conceptual article about emergency calling](/azure/communication-services/concepts/telephony/emergency-calling-concept).

In your *MainActivity.java* file, add the following code to your `onCreate` method to retrieve the emergency button that you created in *activity_main.xml*:

```java
Button emergencyButton = findViewById(R.id.emergency_button);
emergencyButton.setOnClickListener(l->emergencyCall());
```

Modify `createAgent` to specify the emergency country or region:

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
> Azure Communication Services supports enhanced emergency calling to 911 from the United States and Puerto Rico only. The service doesn't support calling 911 from other countries/regions.

## Add functionality to the call button

Add functionality to your emergency call button by adding the following code to your *MainActivity.java* file. For US only, a temporary caller ID is assigned for your emergency call whether or not you provide the `alternateCallerId` parameter.

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
> 933 is a test call service. You can use it to test emergency calling services without interrupting live 911 emergency call services. 911 must be dialed in actual emergency situations.

## Run the app and place a call

:::image type="content" source="../media/emergency-calling/emergency-calling-android-app.png" alt-text="Screenshot of a completed Android calling application.":::

You can now run the app by using the **Run App** button on the toolbar (or by selecting Shift+F10). You can place a call to 933 by selecting the **933 Test Call** button.
