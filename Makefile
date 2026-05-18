all:
	npm run build

metadata:
	exiftool -all= public/images/*.png public/images/about/*.png public/images/art/*.png public/images/games/*.png  public/images/hobbies/*.png  public/images/home/*.png

clean:
	rm -r dist
