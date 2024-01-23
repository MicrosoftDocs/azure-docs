for file in *.md; do
    last_commit_date=$(git log -1 --pretty="format:%ad" --date=format:"%m/%d/%Y" -- "$file")
    echo $last_commit_date
    if [ ! -z "$last_commit_date" ]; then
        sed -i "s|ms.date: [0-9]\{2\}\/[0-9]\{2\}\/[0-9]\{4\}|ms.date: $last_commit_date|" "$file"
    fi
done
