# Chay tu dau

Repo nay khong can cai dat dependency. Tat ca mini project deu la HTML/CSS/JavaScript tinh va co the mo truc tiep bang browser.

## 1. Kiem tra cau truc

```bash
ls
```

Cac thu muc bai lam:

- `mini-project-1/`
- `mini-project-2/`
- `mini-project-3/`

## 2. Chay Mini Project #1

Mo file:

```text
mini-project-1/index.html
```

Bai nay la trang HTML/CSS responsive cho mon IT4409, gom top navigator, left navigator, noi dung article/main, quang cao va footer.

## 3. Chay Mini Project #2

Mo file:

```text
mini-project-2/index.html
```

Bai nay dung DOM JavaScript va `localStorage` de quan tri menu/content. Cac buoc test nhanh:

1. Bam `Admin page` tren top menu.
2. Test `View`, `+ Them menu top`, `Edit`, `Delete`.
3. Bam `View` mot menu top de sang `Admin menu left`.
4. Test them/sua/xoa menu left.
5. Bam `View` mot menu left de sang `Admin contents layout`.
6. Test them/sua/xoa content item va bam nut `i Huong dan layout`.
7. Bam `View` mot content item de sang `Admin contents`, sua HTML trong textarea va xem preview cap nhat ngay.
8. Vao menu `Thong tin sinh vien`, bam `Admin page` -> `View` dong `Thong tin sinh vien`, sau do bam `Reset Thong tin sinh vien`.

Neu browser da luu du lieu cu trong `localStorage`, co the reset ve du lieu mac dinh bang DevTools Console:

```js
localStorage.removeItem("it4409-mini2-state-v2");
location.reload();
```

## 4. Chay Mini Project #3

Mo file:

```text
mini-project-3/index.html
```

Bai nay tiep tuc y tuong My Wiki va goi Wikipedia API bang `fetch`, nen can co Internet. Cac muc co san:

- `Wikipedia Search`: tim kiem theo keyword.
- `Featured topics`: lay tom tat trang Wikipedia.
- `Random discovery`: lay bai viet ngau nhien.

Co the them/xoa content item va doi loai content item trong khung `My Wiki Admin`: `Loai HTML`, `Wikipedia Search`, `Wikipedia Page Summary`, hoac `Wikipedia Random Article`, roi bam `Cap nhat preview`.

Neu browser da luu du lieu cu trong `localStorage`, co the reset ve du lieu mac dinh bang DevTools Console:

```js
localStorage.removeItem("it4409-mini3-state-v2");
location.reload();
```

## 5. Thong tin sinh vien

- Ho ten: Nguyễn Tuấn Đạt
- MSSV: 20235907
- Email: Dat.NT235907@sis.hust.edu.vn
