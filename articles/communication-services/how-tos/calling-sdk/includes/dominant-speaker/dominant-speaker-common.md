Dominant Speakers is an extended feature of the core Call object that allows the user to monitor the most dominant speakers in the current call. Participants can join and leave the list based on how they are performing in the call.

When joined to a group call consisting of multiple participants, the calling SDKs identify which meeting participants are currently speaking. Active speakers identify which participants are being heard in each received audio frame. Dominant speakers identify which participants are currently most active or dominant in the group conversation, though their voice is not necessarily heard in every audio frame. The set of dominant speakers can change as different participants take turns speaking, video subscription requests based on dominant speaker logic can be implemented. 

The main idea is that as participants join, leave, climb up or down in this list of participants, the client application can take this information and customize the call experience accordingly. For example, the client application can show the most dominant speakers in the call in a different UI to separate from the ones that are not participating actively in the call.

Developers can receive updateds and obtain information about the most Dominant Speakers in a call.
This information is being a represented as:
- An ordered list of the Remote Participants that represents the Dominant Speakers in the call.
- A timestamp marking the date when this list was last modified.
