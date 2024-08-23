In summary, the order of priority can be described as:

| `SpeechSynthesisVoiceName` | `SpeechSynthesisLanguage` | SSML | Outcome |
|:----------------------------:|:----------------------------:|:--------:|---------------------------------------------------------|
| ✗ | ✗ | ✗ | Default voice for `en-US` speaks |
| ✗ | ✔ | ✗ | Default voice for specified locale speaks. |
| ✔ | ✔ | ✗ | The voice that you specify by using `SpeechSynthesisVoiceName` speaks. |
| ✔| ✔ | ✔ | The voice that you specify by using SSML speaks. |