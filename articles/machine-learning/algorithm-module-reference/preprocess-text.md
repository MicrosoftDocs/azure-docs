# Preprocess Text


This article describes how to use the **Preprocess Text** module in visual interface (preview) for Azure Machine Learning service, to clean and simplify text. By preprocessing the text, you can more easily create meaningful features from text.

For example, the **Preprocess Text** module supports these common operations on text:

- Removal of stop-words
- Using regular expressions to search for and replace specific target strings
- Lemmatization, which converts multiple related words to a single canonical form
- Case normalization
- Removal of certain classes of characters, such as numbers, special characters, and sequences of repeated characters such as "aaaa"
- Identification and removal of emails and URLs

You can choose which cleaning options to use, and optionally specify a custom list of stop-words.

The module currently supports English only.

## How to configure Text Preprocessing  

1.  Add the **Preprocess Text** module to your experiment in Azure Machine Learning Service. You can find this module under **Text Analytics**.

2. Connect a dataset that has at least one column containing text.

3. Select the language from the **Language** dropdown list. With this option, the text is preprocessed using linguistic rules specific to the selected language. 

6. **Text column to clean**: Select the one column that you want to preprocess.

7. **Remove stop words**: Select this option if you want to apply a predefined stopword list to the text column. 

    Stopword lists are language dependent and customizable; for more information, see the [Technical notes](#bkmk_TechnicalNotes) section.  

8. **Lemmatization**: Select this option if you want words to be represented in their canonical form. This option is useful for reducing the number of unique occurrences of otherwise similar text tokens.

    The lemmatization process is highly language-dependent; see the [Technical notes](#bkmk_TechnicalNotes) section for details.

9. **Detect sentences**: Select this option if you want the module to insert a sentence boundary mark when performing analysis.

    This module uses a series of three pipe characters `|||` to represent the sentence terminator.

10. Optionally, you can perform custom find-and-replace operations using regular expressions.

    - **Custom regular expression**: Define the text you are searching for.
    - **Custom replacement string**: Define a single replacement value.

11. **Normalize case to lowercase**: Select this option if you want to convert ASCII uppercase characters to their lowercase forms.

    If characters are not normalized, the same word in uppercase and lowercase letters is considered two different words: for example, `AM` is the same as `am`.

12. Optionally, you can remove the following types of characters or character sequences from the processed output text:

    - **Remove numbers**: Select this option to remove all numeric characters for the specified language. Identification of what constitutes a number is domain dependent and language dependent. If numeric characters are an integral part of a known word, the number might not be removed.

    - **Remove special characters**: Use this option to remove any non-alphanumeric special characters.

        For more about special characters, see the [Technical notes](#bkmk_TechnicalNotes) section.

    - **Remove duplicate characters**: Select this option to remove extra characters in any sequences that repeat for more than twice. For example, a sequence like "aaaaa" would be reduced to "aa".

    - **Remove email addresses**: Select this option to remove any sequence of the format `<string>@<string>`.  

    - **Remove URLs**: Select this option to remove any sequence that includes the following URL prefixes:
    
        - `http`, `https`
    	- `ftp`
        
        - `www`
    
13. **Expand verb contractions**: This option applies only to languages that use verb contractions; currently, English only. 

    For example, by selecting this option, you could replace the phrase *"wouldn't stay there"* with *"would not stay there"*.

14. **Normalize backslashes to slashes**: Select this option to map all instances of `\\` to `/`.

15. **Split tokens on special characters**: Select this option if you want to break words on characters such as `&`, `-`, and so forth. This option can also reduce the special characters when it repeats more than twice. 

    For example, the string `MS---WORD` would be separated into three tokens, `MS`, `-` and `WORD`.



## See also


[A-Z Module List](a-z-module-list.md)

