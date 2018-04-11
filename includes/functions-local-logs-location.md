When the Functions host runs locally, it writes logs to the following path:

```
<DefaultTempDirectory>\LogFiles\Application\Functions
```

On Windows, `<DefaultTempDirectory>` is the first found value of the TMP, TEMP, USERPROFILE environment variables, or the Windows directory.
On MacOS or Linux, `<DefaultTempDirectory>` is the TMPDIR environment variable.

[!Note]
When the Functions host starts, it will overwrite the existing file structure in the directory.