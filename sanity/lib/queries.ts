export const settingsQuery = `
  *[_type == "siteSettings"][0] {
    venueName,
    accentColor,
    "logoEmblemUrl": logoEmblem.asset->url,
    "logoFullUrl": logoFull.asset->url,
    address,
    phone,
    reservationEmail,
    instagramUrl,
    facebookUrl,
    tiktokUrl,
    googleReviewUrl,
    googleWriteReviewUrl,
    workingHours,
    happyHourActive,
    happyHourFrom,
    happyHourUntil,
    happyHourText,
    lunchMenuActive,
    lunchMenuTitle,
    showPriceBgn,
    showPriceEur,
    footerNote
  }
`

export const categoriesQuery = `
  *[_type == "category" && isActive == true && count(*[_type == "menuItem" && references(^._id) && isAvailable == true]) > 0] | order(orderRank asc) {
    _id,
    name,
    "slug": slug.current,
    icon,
    displayStyle,
    isFeatured
  }
`

export const menuItemsQuery = `
  *[_type == "menuItem" && isAvailable == true] | order(order asc, _createdAt asc) {
    _id,
    name,
    description,
    price,
    volume,
    tags,
    customTags,
    isFeatured,
    isNew,
    allergens,
    subCategory,
    _createdAt,
    "image": image.asset->url,
    "categorySlug": category->slug.current
  }
`

export const todayMenuQuery = `
  *[_type == "dailyMenu" && date == $today && isActive == true][0] {
    _id,
    date,
    title,
    validFrom,
    validUntil,
    chefNote,
    sections[] {
      sectionType,
      heading,
      dishes[]-> {
        _id,
        name,
        description,
        price,
        tags,
        "image": image.asset->url
      }
    }
  }
`