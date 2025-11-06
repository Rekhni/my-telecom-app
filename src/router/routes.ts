import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/MainPage.vue')},
      { path: 'tasks', component: () => import('src/pages/TasksPage.vue') },
      { path: 'admin', component: () => import('src/pages/Admin/AdminPage.vue')},
      { path: 'staff', component: () => import('src/pages/Staff/StaffPage.vue') },
      { path: 'inspection', component: () => import('src/pages/Inspection/InspectionPage.vue') },
      { path: 'measurement', component: () => import('src/pages/Measure/MeasurePage.vue') },
      { path: 'lead', component: () => import('src/pages/Lead/LeadPage.vue') },
      { path: 'inspector', component: () => import('src/pages/Inspector/InspectorPage.vue') },
      { path: 'directory', component: () => import('src/pages/Directory/DirectoryPage.vue') },
      { path: 'admin/roles', component: () => import('src/pages/Admin/RolesPage.vue') },
      { path: 'admin/users', component: () => import('src/pages/Admin/UsersPage.vue') },
      { path: 'admin/settlements', component: () => import('src/pages/Admin/SettlementsPage.vue') },
      { path: 'staff/performers', component: () => import('src/pages/Staff/PerformersPage.vue') },
      { path: 'inspection/planning-inspection', component: () => import('src/pages/Inspection/PlanningInspectionPage.vue') },
      { path: 'inspection/planning-tech-service', component: () => import('src/pages/Inspection/PlanningTechServicePage.vue') },
      { path: 'inspection/planning-curr-repairs', component: () => import('src/pages/Inspection/PlanningCurrentRepairsPage.vue') },
      { path: 'inspection/other-works', component: () => import('src/pages/Inspection/OtherWorksPage.vue') },
      { path: 'inspection/plan-ppr', component: () => import('src/pages/Inspection/PlanPpr.vue') },
      { path: 'measurement/copper-cable-measure', component: () => import('src/pages/Measure/CopperCableMeasurePage.vue') },
      { path: 'measurement/optical-cable-measure', component: () => import('src/pages/Measure/OpticalCableMeasurePage.vue') },
      { path: 'measurement/cable-tightness-measure', component: () => import('src/pages/Measure/CableTightnessMeasurePage.vue') },
      { path: 'measurement/grounding-measure', component: () => import('src/pages/Measure/GroundingMeasurePage.vue') },
      { path: 'lead/stat-agreement', component: () => import('src/pages/Lead/StatAgreementPage.vue') },
      { path: 'lead/rescheduling', component: () => import('src/pages/Lead/ReschedulingPage.vue') },
      { path: 'inspector/inspector-planning', component: () => import('src/pages/Inspector/InspectorPlanningPage.vue') },
      { path: 'inspector/controller-planning', component: () => import('src/pages/Inspector/ControllerPlanningPage.vue') },
      { path: 'inspector/rescheduling-controller-planning', component: () => import('src/pages/Inspector/ReschedulingControllerPlanningPage.vue') },
      { path: 'directory/materials', component: () => import('src/pages/Directory/MaterialsPage.vue') },
      { path: 'directory/units-measurement', component: () => import('src/pages/Directory/UnitsMeasurementPage.vue') },
      { path: 'directory/object-defect-types', component: () => import('src/pages/Directory/ObjectDefectTypesPage.vue') },
      { path: 'directory/tech-maps', component: () => import('src/pages/Directory/TechMapsPage.vue') },
      { path: 'directory/defect-destroying-works', component: () => import('src/pages/Directory/DefectDestroyingWorksPage.vue') },
      { path: 'directory/measure-resources', component: () => import('src/pages/Directory/MeasureResourcesPage.vue') },
      { path: 'directory/measure-resources-type', component: () => import('src/pages/Directory/MeasureResourcesTypePage.vue') },
      { path: 'directory/other-works-types', component: () => import('src/pages/Directory/OtherWorksTypesPage.vue') },
      { path: 'directory/weekends-holidays', component: () => import('src/pages/Directory/WeekendsHolidaysPage.vue') },
      { path: 'directory/branches', component: () => import('src/pages/Directory/BranchesPage.vue') },
      { path: 'inventory', component: () => import('src/pages/Inventory/InventoryPage.vue') }

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
