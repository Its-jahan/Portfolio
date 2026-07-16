from PIL import Image

def make_transparent():
    img = Image.open('src/assets/wax-seal-badge.png').convert("RGBA")
    datas = img.getdata()

    newData = []
    # threshold for near-white
    for item in datas:
        # Check if the pixel is near white
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save("src/assets/wax-seal-transparent.png", "PNG")

make_transparent()
print("Done!")
