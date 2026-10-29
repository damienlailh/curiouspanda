# Chemistry PDFs

The five topic cards live in `../chemistry.html`. Each topic has its own folder:

- `acid-base/`
- `atomic-structure/`
- `chemical-bonding/`
- `electrochemistry/`
- `gaseous-state/`

To publish a PDF:

1. Copy the file into its topic folder. You can choose any filename.
2. Open `chemistry.html` at the site root and find the matching card.
3. Replace the empty `href=""` on its Questions or Worked solutions link with the path from the site root, for example `href="chemistry/acid-base/worked-solutions.pdf"`.

That is the only code edit needed per PDF. On the next page load the link becomes active, its label changes from Coming soon to Download, and the download attribute lets the browser save the file. Use the exact filename and letter case. Each card shows Questions first, followed by Worked solutions, with an independent PDF link for each.

Keep an empty href for any resource you have not uploaded yet. The `.gitkeep` files preserve empty topic folders in Git; they can stay after PDFs are added. No PDF filenames or sizes are assumed in the interface.

Page styles and search/placeholder behaviour are in `chemistry.css` and `chemistry.js` beside this guide.
