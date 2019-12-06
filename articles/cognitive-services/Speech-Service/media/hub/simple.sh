for f in *_*; do mv -v "$f" $(echo "$f" | tr '_' '-'); done
