# School-of-Gen-Z
# School of Genji — Personal Frame Generator

এই version-এ দেওয়া 1024×1024 frame image-টি `assets/image_5.png` হিসেবে বসানো হয়েছে।

## কী করতে হবে
1. ZIP extract করো।
2. VS Code-এ folder open করো।
3. **Live Server** দিয়ে `index.html` চালাও।
4. ব্যক্তির বাংলা/ইংরেজি নাম, পদবী ও প্রতিষ্ঠানের নাম লিখো।
5. ব্যক্তির ছবি upload করো।
6. `Automatic Background Remove` on থাকলে browser-side model দিয়ে background remove করার চেষ্টা করবে।
7. `Generate & Download` চাপলে 1024×1024 PNG পাওয়া যাবে।

## Folder
```text
school-of-genji-frame-generator/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    └── image_5.png
```

## এই frame-এর positioning
- Portrait area: প্রায় `x=150, y=125, width=725, height=485`
- Dynamic details: নিচের red footer-এর ডান পাশে
- Original title/footer foreground redraw করা হয় যাতে person's photo এগুলোর ওপর না উঠে যায়।

যদি portrait-এর size/position পরিবর্তন করতে চাও, `script.js`-এর `drawPerson()` function-এর `area` object edit করবে।

## Background removal note
এখানে API key নেই। `@imgly/background-removal` browser-side import করা হয়েছে। প্রথমবার model download হতে পারে এবং internet দরকার হবে। Production site-এ নিজের backend/local model ব্যবহার করলে আরও নিয়ন্ত্রিত হবে।
