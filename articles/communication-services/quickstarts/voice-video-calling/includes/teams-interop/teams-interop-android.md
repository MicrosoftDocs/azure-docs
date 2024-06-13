---
title: Quickstart - Join a Teams meeting from an Android app
description: In this tutorial, you learn how to join a Teams meeting using the Azure Communication Services Calling SDK for Android
author: tophpalmer
ms.author: rifox
ms.date: 03/10/2021
ms.topic: include
ms.service: azure-communication-services
---

In this quickstart, you'll learn how to join a Teams meeting using the Azure Communication Services Calling SDK for Android.

## Sample Code
Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/join-call-to-teams-meeting).

## Prerequisites

- A working [Communication Services calling Android app](../../getting-started-with-calling.md).
- A [Teams deployment](/deployoffice/teams-install).
- The Minimum Version supported for Teams meeting ID and passcode join API: 2.9.0
- An [access token](../../../identity/access-tokens.md).


## Add the Teams UI controls

Replace code in activity_main.xml with following snippet. The text box will be used to enter the Teams meeting context and the button will be used to join the specified meeting:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">
    
    <LinearLayout    
    android:id="@+id/meetingInfoLinearLayout"    
    android:layout_width="match_parent"    
    android:layout_height="match_parent"    
    android:orientation="vertical"    
    android:layout_marginTop="100dp">

        <EditText    
            android:id="@+id/teams_meeting_link"    
            android:layout_width="match_parent"    
            android:layout_height="wrap_content"    
            android:ems="10"    
            android:hint="Teams meeting link"    
            android:inputType="textUri" />
            
        <TextView    
            android:layout_width="match_parent"    
            android:layout_height="wrap_content"    
            android:text="or"    
            android:textAlignment="center"    
            android:layout_marginTop="10dp"/>
            
        <EditText    
            android:id="@+id/teams_meeting_id"    
            android:layout_width="match_parent"    
            android:layout_height="wrap_content"    
            android:ems="10"    
            android:hint="Teams meeting id"    
            android:inputType="textUri" />
        
        <EditText    
            android:id="@+id/teams_meeting_passcode"    
            android:layout_width="match_parent"    
            android:layout_height="wrap_content"    
            android:ems="10"    
            android:hint="Teams meeting passcode"    
            android:inputType="textUri" />
        
    </LinearLayout>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="70dp"
        android:gravity="center"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent">

        <Button
            android:id="@+id/join_meeting_button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Join Meeting" />

        <Button
            android:id="@+id/hangup_button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Hangup" />

    </LinearLayout>

    <TextView
        android:id="@+id/call_status_bar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="40dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent" />

    <TextView
        android:id="@+id/recording_status_bar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginBottom="20dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

## Enable the Teams UI controls

Replace the content of `MainActivity.java` with following snippet:

```java

package com.contoso.acsquickstart;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.concurrent.ExecutionException;

import com.azure.android.communication.calling.Call;
import com.azure.android.communication.calling.CallAgent;
import com.azure.android.communication.calling.CallClient;
import com.azure.android.communication.calling.HangUpOptions;
import com.azure.android.communication.calling.JoinCallOptions;
import com.azure.android.communication.common.CommunicationTokenCredential;
import com.azure.android.communication.calling.TeamsMeetingLinkLocator;
// import for meeting id and passcode join
// import com.azure.android.communication.calling.TeamsMeetingIdLocator;

public class MainActivity extends AppCompatActivity {
    private static final String[] allPermissions = new String[] { Manifest.permission.RECORD_AUDIO, Manifest.permission.CAMERA, Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.READ_PHONE_STATE };
    private static final String UserToken = "<User_Access_Token>";

    TextView callStatusBar;
    TextView recordingStatusBar;

    private CallAgent agent;
    private Call call;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        getAllPermissions();
        createAgent();

        Button joinMeetingButton = findViewById(R.id.join_meeting_button);
        joinMeetingButton.setOnClickListener(l -> joinTeamsMeeting());

        Button hangupButton = findViewById(R.id.hangup_button);
        hangupButton.setOnClickListener(l -> leaveMeeting());

        callStatusBar = findViewById(R.id.call_status_bar);
        recordingStatusBar = findViewById(R.id.recording_status_bar);
    }

    /**
     * Join Teams meeting
     */
    private void joinTeamsMeeting() {
        if (UserToken.startsWith("<")) {
            Toast.makeText(this, "Please enter token in source code", Toast.LENGTH_SHORT).show();
            return;
        }

        EditText calleeIdView = findViewById(R.id.teams_meeting_link);
        EditText calleeMeetingId = findViewById(R.id.teams_meeting_id);
        EditText calleeMeetingPasscode = findViewById(R.id.teams_meeting_passcode);
        String meetingLink = calleeIdView.getText().toString();
        String meetingId = calleeMeetingId.getText().toString();
        String passcode = calleeMeetingPasscode.getText().toString();

        if (meetingLink.isEmpty()) {
            Toast.makeText(this, "Please enter Teams meeting link", Toast.LENGTH_SHORT).show();
            return;
        }

        JoinCallOptions options = new JoinCallOptions();

        // join with meeting link
        TeamsMeetingLinkLocator teamsMeetingLocator = new TeamsMeetingLinkLocator(meetingLink);

        // (or) to join with meetingId and passcode use the below code snippet.
        //TeamsMeetingIdLocator teamsMeetingIdLocator = new TeamsMeetingIdLocator(meetingId, passcode);

        call = agent.join(
                getApplicationContext(),
                teamsMeetingLocator,
                options);
        call.addOnStateChangedListener(p -> setCallStatus(call.getState().toString()));
        call.addOnIsRecordingActiveChangedListener(p -> setRecordingStatus(call.isRecordingActive()));
    }

    /**
     * Leave from the meeting
     */
    private void leaveMeeting() {
        try {
            call.hangUp(new HangUpOptions()).get();
        } catch (ExecutionException | InterruptedException e) {
            Toast.makeText(this, "Unable to leave meeting", Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * Create the call agent
     */
    private void createAgent() {
        try {
            CommunicationTokenCredential credential = new CommunicationTokenCredential(UserToken);
            agent = new CallClient().createCallAgent(getApplicationContext(), credential).get();
        } catch (Exception ex) {
            Toast.makeText(getApplicationContext(), "Failed to create call agent.", Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * Request each required permission if the app doesn't already have it.
     */
    private void getAllPermissions() {
        ArrayList<String> permissionsToAskFor = new ArrayList<>();
        for (String permission : allPermissions) {
            if (ActivityCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                permissionsToAskFor.add(permission);
            }
        }
        if (!permissionsToAskFor.isEmpty()) {
            ActivityCompat.requestPermissions(this, permissionsToAskFor.toArray(new String[0]), 1);
        }
    }

    /**
     * Ensure all permissions were granted, otherwise inform the user permissions are missing.
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, int[] grantResults) {
        boolean allPermissionsGranted = true;
        for (int result : grantResults) {
            allPermissionsGranted &= (result == PackageManager.PERMISSION_GRANTED);
        }
        if (!allPermissionsGranted) {
            Toast.makeText(this, "All permissions are needed to make the call.", Toast.LENGTH_LONG).show();
            finish();
        }
    }

    /**
     * Shows call status in status bar
     */
    private void setCallStatus(String status) {
        runOnUiThread(() -> callStatusBar.setText(status));
    }

    /**
     * Shows recording status bar
     */
    private void setRecordingStatus(boolean status) {
        if (status == true) {
            runOnUiThread(() -> recordingStatusBar.setText("This call is being recorded"));
        }
        else {
            runOnUiThread(() -> recordingStatusBar.setText(""));
        }
    }
}

```

## Get the Teams meeting link

The Teams meeting link can be retrieved using Graph APIs. This is detailed in [Graph documentation](/graph/api/onlinemeeting-createorget?tabs=http&view=graph-rest-beta&preserve-view=true).
The Communication Services Calling SDK accepts a full Teams meeting link. This link is returned as part of the `onlineMeeting` resource, accessible under the [`joinWebUrl` property](/graph/api/resources/onlinemeeting?view=graph-rest-beta&preserve-view=true). You can also get the required meeting information from the **Join Meeting** URL in the Teams meeting invite itself.

## Get the Teams meeting ID and passcode
* Graph API: Use Graph API to retrieve information about onlineMeeting resource and check the object in property joinMeetingIdSettings.
* Teams: In your Teams application, go to Calendar app and open details of a meeting. Online meetings have meeting ID and passcode in the definition of the meeting.
* Outlook: You can find the meeting ID & passcode in calendar events or in email meeting invites.

## Launch the app and join Teams meeting

The app can now be launched using the "Run App" button on the toolbar (Shift+F10). You should see the following:

:::image type="content" source="../../media/android/acs-join-teams-meeting-quickstart.png" alt-text="Screenshot showing the completed application.":::

Insert the Teams context into the text box and press *Join Meeting* to join the Teams meeting from within your Communication Services application.
