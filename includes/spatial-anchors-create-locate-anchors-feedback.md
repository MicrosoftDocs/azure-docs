## Provide feedback to the user

You can write code to handle the session updated event. This event fires every time the session improves its understanding of your surroundings. Doing so, allows you to:

- Use the `UserFeedback` class to provide feedback to the user as the device moves and the session updates its environment understanding. To do this,
- Determine at what point there's enough tracked spatial data to create spatial anchors. You determine this with either `ReadyForCreateProgress` or `RecommendedForCreateProgress`. Once `ReadyForCreateProgress` is above 1, we have enough data to save a cloud spatial anchor, though we recommend you wait until `RecommendedForCreateProgress` is above 1 to do so.
