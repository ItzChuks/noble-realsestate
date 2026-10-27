/// <reference path="../pb_data/types.d.ts" />
// Creates everything Noble Estates & Motors needs. Runs automatically the first
// time you start PocketBase (v0.23 or newer) from the folder that contains this one.

migrate((app) => {
  const dates = [
    { type: "autodate", name: "created", onCreate: true, onUpdate: false },
    { type: "autodate", name: "updated", onCreate: true, onUpdate: true },
  ];

  const photos = {
    type: "file",
    name: "images",
    maxSelect: 5,
    maxSize: 5242880,
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    thumbs: ["640x480", "160x120"],
  };

  // Anyone can read listings. Only a superuser (you) can create, edit or delete them.
  const publicRead = {
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
  };

  const sel = (name, values, required = true) => ({
    type: "select", name, values, maxSelect: 1, required,
  });

  app.save(new Collection({
    type: "base",
    name: "properties",
    ...publicRead,
    fields: [
      { type: "text", name: "title", required: true, max: 160 },
      sel("houseType", ["Duplex", "Villa", "Bungalow", "Apartment", "Terrace", "Penthouse"]),
      sel("status", ["Sale", "Rent"]),
      { type: "number", name: "price", required: true, min: 1 },
      { type: "text", name: "location", required: true, max: 160 },
      { type: "number", name: "beds", min: 0 },
      { type: "number", name: "baths", min: 0 },
      { type: "number", name: "area", min: 0 },
      { type: "text", name: "description", required: true, max: 10000 },
      photos,
      { type: "text", name: "imageUrls", max: 5000 },
      { type: "bool", name: "sold" },
      ...dates,
    ],
  }));

  app.save(new Collection({
    type: "base",
    name: "cars",
    ...publicRead,
    fields: [
      { type: "text", name: "title", required: true, max: 160 },
      { type: "text", name: "make", required: true, max: 60 },
      { type: "text", name: "model", required: true, max: 80 },
      { type: "number", name: "year", required: true, min: 1950, max: 2100, onlyInt: true },
      sel("bodyType", ["SUV", "Sedan", "Hatchback", "Coupe", "Pickup", "Bus/Van"]),
      sel("condition", ["Brand new", "Foreign used", "Nigerian used"]),
      sel("transmission", ["Automatic", "Manual"]),
      sel("fuel", ["Petrol", "Diesel", "Hybrid", "Electric"]),
      { type: "number", name: "mileage", min: 0 },
      { type: "text", name: "color", max: 40 },
      { type: "number", name: "price", required: true, min: 1 },
      { type: "text", name: "location", required: true, max: 160 },
      { type: "text", name: "description", required: true, max: 10000 },
      photos,
      { type: "text", name: "imageUrls", max: 5000 },
      { type: "bool", name: "sold" },
      ...dates,
    ],
  }));

  // Visitors can leave an enquiry. Only you can read them.
  app.save(new Collection({
    type: "base",
    name: "enquiries",
    listRule: null,
    viewRule: null,
    createRule: "",
    updateRule: null,
    deleteRule: null,
    fields: [
      { type: "text", name: "name", required: true, max: 100 },
      { type: "text", name: "phone", required: true, max: 30 },
      { type: "text", name: "message", max: 1000 },
      { type: "text", name: "listingType", max: 20 },
      { type: "text", name: "listingId", max: 30 },
      { type: "text", name: "listingTitle", max: 160 },
      ...dates,
    ],
  }));
}, (app) => {
  for (const name of ["enquiries", "cars", "properties"]) {
    try { app.delete(app.findCollectionByNameOrId(name)); } catch (_) {}
  }
});
